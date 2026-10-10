/**
 * @nuxtjs/supabase calls getClaims() on every SSR request, and each request
 * creates a new GoTrue client, so JWKS is never reused. A single undici
 * connect timeout (10s × 3 retries) then logs a ConnectTimeoutError, which
 * Nuxt cannot serialize (NUXT_E8003).
 *
 * Cache JWKS in-process and serve a stale copy if Supabase is unreachable.
 */
const JWKS_PATH = '/auth/v1/.well-known/jwks.json'
const FRESH_MS = 10 * 60 * 1000
const STALE_MS = 24 * 60 * 60 * 1000

type JwksEntry = {
	body: string
	contentType: string
	fetchedAt: number
}

const jwksCache = new Map<string, JwksEntry>()

function requestUrl(input: RequestInfo | URL): string {
	if (typeof input === 'string') {
		return input
	}
	if (input instanceof URL) {
		return input.href
	}
	if (typeof Request !== 'undefined' && input instanceof Request) {
		return input.url
	}
	return ''
}

function toPlainError(error: unknown): Error {
	const err = error as { message?: string; cause?: { message?: string } }
	const message = [err?.message, err?.cause?.message]
		.filter(Boolean)
		.join(': ')
	return new Error(message || 'fetch failed')
}

function cachedResponse(entry: JwksEntry): Response {
	return new Response(entry.body, {
		status: 200,
		headers: { 'content-type': entry.contentType },
	})
}

export default defineNitroPlugin(() => {
	const originalFetch = globalThis.fetch.bind(globalThis)

	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = requestUrl(input)
		if (!url.includes(JWKS_PATH)) {
			return originalFetch(input, init)
		}

		const now = Date.now()
		const cached = jwksCache.get(url)
		if (cached && now - cached.fetchedAt < FRESH_MS) {
			return cachedResponse(cached)
		}

		try {
			const res = await originalFetch(input, init)
			const body = await res.text()
			const contentType = res.headers.get('content-type') || 'application/json'
			if (res.ok) {
				jwksCache.set(url, { body, contentType, fetchedAt: now })
			}
			return new Response(body, {
				status: res.status,
				headers: { 'content-type': contentType },
			})
		} catch (error) {
			if (cached && now - cached.fetchedAt < STALE_MS) {
				return cachedResponse(cached)
			}
			throw toPlainError(error)
		}
	}) as typeof fetch

	const supabaseUrl = useRuntimeConfig().public?.supabase?.url as
		| string
		| undefined
	if (!supabaseUrl) {
		return
	}

	const jwksUrl = `${String(supabaseUrl).replace(/\/$/, '')}${JWKS_PATH}`
	void originalFetch(jwksUrl)
		.then(async (res) => {
			if (!res.ok) {
				return
			}
			const body = await res.text()
			jwksCache.set(jwksUrl, {
				body,
				contentType: res.headers.get('content-type') || 'application/json',
				fetchedAt: Date.now(),
			})
		})
		.catch(() => {
			// First authenticated request will retry.
		})
})

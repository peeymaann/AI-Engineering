/* eslint-disable prettier/prettier */
import type { Response } from 'express'

/**
 * Collect headers already set on the Express response (including CORS).
 * `ServerResponse.writeHead(status, headers)` replaces existing headers,
 * so streaming helpers must pass these through.
 */
export function existingResponseHeaders(res: Response): Record<string, string> {
	const headers: Record<string, string> = {}

	for (const name of res.getHeaderNames()) {
		const value = res.getHeader(name)
		if (value === undefined) continue
		headers[name] = Array.isArray(value) ? value.join(', ') : String(value)
	}

	return headers
}

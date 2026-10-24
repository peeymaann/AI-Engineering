import { embed } from 'ai'
import { google } from '@ai-sdk/google'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabaseAdmin } from '../utils/supabase-admin'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

function getEmbeddingModel() {
	if (process.env.USE_GEMINI_EMBEDDING === 'true' || process.env.VERCEL === '1') {
		return google.textEmbeddingModel('gemini-embedding-001')
	}
	return ollama.embedding('nomic-embed-text')
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const content = body?.content?.trim()
	const userId = readUserId(body?.user_id)

	if (!content || typeof content !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'content is required',
		})
	}

	const chunkSize = 500
	const chunks: string[] = []
	for (let i = 0; i < content.length; i += chunkSize) {
		chunks.push(content.slice(i, i + chunkSize))
	}

	const supabase = useServerSupabaseAdmin()
	let saved = 0

	const isCloud = process.env.VERCEL === '1' || process.env.USE_GEMINI_EMBEDDING === 'true'
	const embeddingColumn = isCloud ? 'embedding_gemini' : 'embedding'

	for (const chunk of chunks) {
		const { embedding } = await embed({
			model: getEmbeddingModel(),
			value: chunk,
		})

		const { error } = await supabase.from('documents').insert({
			content: chunk,
			[embeddingColumn]: embedding,
			metadata: { source: 'manual-upload' },
			...(userId ? { user_id: userId } : {}),
		})

		if (error) {
			throw createError({
				statusCode: 500,
				statusMessage: error.message,
			})
		}

		saved++
	}

	return {
		ok: true,
		saved,
	}
})

function readUserId(value: unknown) {
	if (value == null || value === '') return null
	if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'user_id must be a UUID',
		})
	}
	return value
}
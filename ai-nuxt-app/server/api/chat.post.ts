import { embed } from 'ai'
import { google } from '@ai-sdk/google'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabaseAdmin } from '../utils/supabase-admin'
import { serverSupabaseUser } from '#supabase/server'

const isProduction = process.env.NODE_ENV === 'production'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

function getEmbeddingModel() {
	if (isProduction || process.env.USE_GEMINI_EMBEDDING === 'true') {
		return google.textEmbeddingModel('gemini-embedding-001')
	}

	return ollama.embedding('nomic-embed-text')
}

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event)
	const userId = user?.id || user?.sub

	if (!userId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Login required',
		})
	}

	const body = await readBody(event)
	const content = body?.content?.trim()

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

	for (const chunk of chunks) {
		const { embedding } = await embed({
			model: getEmbeddingModel(),
			value: chunk,
		})

		const { error } = await supabase.from('documents').insert({
			content: chunk,
			embedding,
			metadata: { source: 'manual-upload' },
			user_id: userId,
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
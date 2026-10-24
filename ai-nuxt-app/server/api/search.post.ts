import { embed } from 'ai'
import { google } from '@ai-sdk/google'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabase } from '../utils/supabase'

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
	const { query } = await readBody(event)

	if (!query || typeof query !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'query is required',
		})
	}

	const { embedding } = await embed({
		model: getEmbeddingModel(),
		value: query,
	})

	const supabase = useServerSupabase()

	const isCloud = process.env.VERCEL === '1' || process.env.USE_GEMINI_EMBEDDING === 'true'
	const rpcName = isCloud ? 'match_documents_gemini' : 'match_documents'

	const { data, error } = await supabase.rpc(rpcName, {
		query_embedding: embedding,
		match_threshold: 0.1,
		match_count: 3,
	})

	if (error) {
		return { ok: false, message: error.message }
	}

	return {
		ok: true,
		matches: data,
	}
})
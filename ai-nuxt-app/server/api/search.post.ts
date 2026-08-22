import { embed } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabase } from '../utils/supabase'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const { query } = await readBody(event)

	if (!query || typeof query !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'query is required',
		})
	}

	// ۱) Embedding برای سؤال
	// 1) Embedding for the question
	const { embedding } = await embed({
		model: ollama.embedding('nomic-embed-text'),
		value: query,
	})

	const supabase = useServerSupabase()

	// ۲) جستجوی اسناد شبیه
	// 2) Search for similar documents
	const { data, error } = await supabase.rpc('match_documents', {
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

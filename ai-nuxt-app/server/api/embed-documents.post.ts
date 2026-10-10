import { embed } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabaseAdmin } from '../utils/supabase-admin'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async () => {
	const supabase = useServerSupabaseAdmin()

	const { data: docs, error } = await supabase
		.from('documents')
		.select('id, content')
		.is('embedding', null)

	if (error) {
		return { ok: false, message: error.message }
	}

	if (!docs?.length) {
		return { ok: true, message: 'No documents to embed', updated: 0 }
	}

	let updated = 0

	for (const doc of docs) {
		const { embedding } = await embed({
			model: ollama.embedding('nomic-embed-text'),
			value: doc.content,
		})

		const { data: updatedRows, error: updateError } = await supabase
			.from('documents')
			.update({ embedding })
			.eq('id', doc.id)
			.select('id')

		if (updateError) {
			return { ok: false, message: updateError.message, updated }
		}

		if (!updatedRows?.length) {
			return {
				ok: false,
				message: `Update blocked for id=${doc.id}`,
				updated,
			}
		}

		updated++
	}

	return { ok: true, updated }
})

import {
	convertToModelMessages,
	embed,
	streamText,
	type UIMessage,
} from 'ai'
import { startObservation } from '@langfuse/tracing'
import { createOllama } from 'ollama-ai-provider-v2'
import { serverSupabaseUser } from '#supabase/server'
import { useServerSupabase } from '../utils/supabase'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event)
	const userId = user?.id || user?.sub

	if (!userId) {
		throw createError({ statusCode: 401, statusMessage: 'Login required' })
	}

	const { messages }: { messages: UIMessage[] } = await readBody(event)

	const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')

	const question =
		lastUserMessage?.parts
			?.filter((p: any) => p.type === 'text')
			?.map((p: any) => p.text)
			?.join(' ') ||
		(lastUserMessage as any)?.content ||
		''

	if (!question) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No user question found',
		})
	}

	const { embedding } = await embed({
		model: ollama.embedding('nomic-embed-text'),
		value: question,
	})

	const supabase = useServerSupabase()
	const { data: matches, error } = await supabase.rpc('match_documents', {
		query_embedding: embedding,
		match_count: 3,
		filter_user_id: userId,
	})

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: error.message,
		})
	}

	const context =
		matches?.map((m: any) => m.content).join('\n\n') ||
		'هیچ سند مرتبطی پیدا نشد.'

	const generation = startObservation(
		'chat-rag',
		{
			model: 'gemma2:2b',
			input: question,
			metadata: { userId, matches: matches?.length ?? 0 },
		},
		{ asType: 'generation' },
	)

	const result = streamText({
		model: ollama('gemma2:2b'),
		system: `تو دستیار کاربر هستی و فارسی جواب می‌دهی.
متن‌های زیر اسناد خود کاربر است، نه حرف تو.
اگر سند با «من» نوشته شده، آن «من» کاربر است.
به کاربر با «تو» جواب بده. هرگز نگو «من عاشق ... هستم».
فقط از اسناد جواب بده. اگر سند کافی نبود بگو: «در اسناد موجود پیدا نکردم.»

اسناد:
${context}`,
		messages: await convertToModelMessages(messages),
		temperature: 0.2,
		onFinish: ({ text }) => {
			generation.update({ output: text })
			generation.end()
		},
	})

	return result.toUIMessageStreamResponse()
})
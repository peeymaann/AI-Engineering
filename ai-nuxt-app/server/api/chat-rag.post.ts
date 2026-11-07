import {
	convertToModelMessages,
	embed,
	streamText,
	type UIMessage,
} from 'ai'
import { startObservation } from '@langfuse/tracing'
import { createOllama } from 'ollama-ai-provider-v2'
import { google } from '@ai-sdk/google'
import { serverSupabaseUser } from '#supabase/server'
import { useServerSupabase } from '../utils/supabase'

const isProduction = process.env.NODE_ENV === 'production'

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

	// فقط یک Trace والد
	const trace = startObservation('chat-rag', {
		input: question,
		metadata: { userId },
	})

	try {
		// ۱. Embedding سؤال
		const embedSpan = trace.startObservation('embed-question', {
			input: question,
		})

		const embeddingModel = isProduction
			? google.embedding('gemini-embedding-001')
			: ollama.embedding('nomic-embed-text')

		const { embedding } = await embed({
			model: embeddingModel,
			value: question,
		})

		embedSpan.update({ output: { dimensions: embedding.length } })
		embedSpan.end()

		// ۲. جستجوی شباهت
		const searchSpan = trace.startObservation('similarity-search', {
			input: { match_count: 3, userId },
		})

		const supabase = useServerSupabase()
		const { data: matches, error } = await supabase.rpc('match_documents', {
			query_embedding: embedding,
			match_count: 3,
			filter_user_id: userId,
		})

		if (error) {
			searchSpan.update({ output: { error: error.message } })
			searchSpan.end()
			throw createError({
				statusCode: 500,
				statusMessage: error.message,
			})
		}

		searchSpan.update({
			output: {
				count: matches?.length ?? 0,
				contents: matches?.map((m: any) => m.content?.slice(0, 80)),
			},
		})
		searchSpan.end()

		const context =
			matches?.map((m: any) => m.content).join('\n\n') ||
			'هیچ سند مرتبطی پیدا نشد.'

		// ۳. تولید پاسخ
		const chatModelName = isProduction ? 'gemini-3.8-flash' : 'gemma2:2b'
		const chatModel = isProduction
			? google(chatModelName)
			: ollama(chatModelName)

		const generation = trace.startObservation(
			'generate-answer',
			{
				model: chatModelName,
				input: question,
				metadata: { matches: matches?.length ?? 0 },
			},
			{ asType: 'generation' },
		)

		const result = streamText({
			model: chatModel,
			system: `تو دستیار کاربر هستی و فارسی جواب می‌دهی.
متن‌های زیر اسناد خود کاربر است، نه حرف تو.
اگر سند با «من» نوشته شده، آن «من» کاربر است.
به کاربر با «تو» جواب بده. هرگز نگو «من عاشق ... هستم».
فقط از اسناد جواب بده. اگر سند کافی نبود بگو: «در اسناد موجود پیدا نکردم.»

اسناد:
${context}`,
			messages: await convertToModelMessages(messages),
			temperature: 0.2,
			experimental_telemetry: {
				isEnabled: true,
				functionId: 'chat-rag',
			},
			onFinish: ({ text }) => {
				generation.update({ output: text })
				generation.end()
				trace.end()
			},
		})

		return result.toUIMessageStreamResponse()
	} catch (err) {
		trace.update({ output: { error: (err as Error).message } })
		trace.end()
		throw err
	}
})
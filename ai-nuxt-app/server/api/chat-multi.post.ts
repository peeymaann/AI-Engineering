import {
	convertToModelMessages,
	embed,
	generateText,
	streamText,
	type UIMessage,
} from 'ai'
import { google } from '@ai-sdk/google'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabase } from '../utils/supabase'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const { messages }: { messages: UIMessage[] } = await readBody(event)

	const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')

	const question =
		lastUserMessage?.parts
			.filter((part): part is { type: 'text'; text: string } => part.type === 'text')
			.map((part) => part.text)
			.join(' ')
			.trim() ?? ''

	if (!question) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No user question found',
		})
	}

	// Researcher: embedding با Ollama (همان قبلی)
	const { embedding } = await embed({
		model: ollama.embedding('nomic-embed-text'),
		value: question,
	})

	const supabase = useServerSupabase()
	const { data: matches, error } = await supabase.rpc('match_documents', {
		query_embedding: embedding,
		match_threshold: 0.3,
		match_count: 3,
	})

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: error.message,
		})
	}

	const rows = (matches ?? []) as Array<{ content?: string | null }>
	const researchNotes =
		rows
			.map((row) => row.content)
			.filter((content): content is string => Boolean(content))
			.join('\n\n') || 'هیچ سند مرتبطی پیدا نشد.'

	// Writer — جایگزینی Grok با Gemini
	const { text: draft } = await generateText({
		model: google('gemini-2.5-flash') as unknown as Parameters<typeof generateText>[0]['model'],
		temperature: 0.3,
		prompt: `نقش تو Writer است.
فقط از یادداشت‌های محقق استفاده کن.
پاسخ را کوتاه و فارسی بنویس.
اگر اطلاعات کافی نبود بگو پیدا نشد.

سؤال کاربر:
${question}

یادداشت محقق:
${researchNotes}`,
	})

	// Reviewer — جایگزینی Grok با Gemini
	const result = streamText({
		model: google('gemini-2.5-flash') as unknown as Parameters<typeof streamText>[0]['model'],
		temperature: 0.2,
		messages: await convertToModelMessages(messages),
		system: `تو فقط پاسخ نهایی را برای کاربر می‌نویسی.
فارسی، کوتاه و طبیعی حرف بزن.
درباره نقش Researcher یا Writer یا Reviewer چیزی نگو.
اگر سؤال سلام است، فقط سلام کن.
اگر سؤال از اسناد است، فقط از یادداشت محقق استفاده کن.
اگر فارسی سوال شد، فقط فارسی بنویس. اگر انگلیسی سوال شد، فقط انگلیسی بنویس.
اگر در یادداشت نبود بگو: در اسناد موجود پیدا نکردم.

یادداشت محقق:
${researchNotes}

پیش‌نویس داخلی (فقط برای اصلاح؛ برای کاربر تکرار نکن):
${draft}`,
	})

	return result.toUIMessageStreamResponse()
})
import {
	convertToModelMessages,
	embed,
	streamText,
	type UIMessage,
} from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { useServerSupabase } from '../utils/supabase'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const { messages }: { messages: UIMessage[] } = await readBody(event)

	// آخرین پیام کاربر
	// User's last message
	const lastUserMessage = [...messages]
		.reverse()
		.find((m) => m.role === 'user')

	const question =
		lastUserMessage?.parts
			?.filter((p: any) => p.type === 'text')
			?.map((p: any) => p.text)
			?.join(' ') ||
		// fallback برای ساختارهای قدیمی‌تر
		// Fallback for older structures
		(lastUserMessage as any)?.content ||
		''

	if (!question) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No user question found',
		})
	}

	// ۱) Embedding سؤال
	// 1) Question Embedding
	const { embedding } = await embed({
		model: ollama.embedding('nomic-embed-text'),
		value: question,
	})

	// ۲) جستجوی اسناد مرتبط
	// 2) Searching for related documents
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

	const context =
		matches?.map((m: any) => m.content).join('\n\n') ||
		'هیچ سند مرتبطی پیدا نشد.| No relevant document was found.'

	// ۳) پاسخ مدل با context
	// 3) Model response with context
	const result = streamText({
		model: ollama('gemma2:2b'),
//Prompt: You are a Persian-speaking assistant. Answer only based on the information below. 
// If the answer is not in the information, say: "I did not find it in the available documents."

Information:
		system: `تو یک دستیار فارسی‌زبان هستی.
فقط بر اساس اطلاعات زیر جواب بده.
اگر جواب در اطلاعات نبود، بگو: «در اسناد موجود پیدا نکردم.»


اطلاعات:
${context}`,
		messages: await convertToModelMessages(messages),
		temperature: 0.3,
	})

	return result.toUIMessageStreamResponse()
})

import {
	convertToModelMessages,
	embed,
	generateText,
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

	// 1) Researcher: سند مرتبط را پیدا کن
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

	const researchNotes =
		matches?.map((m: any) => m.content).join('\n\n') ||
		'هیچ سند مرتبطی پیدا نشد.'

	// 2) Writer: پیش‌نویس جواب
	const { text: draft } = await generateText({
		model: ollama('gemma2:2b'),
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

	// 3) Reviewer: نسخه نهایی را استریم کن
	const result = streamText({
		model: ollama('gemma2:2b'),
		temperature: 0.2,
		messages: await convertToModelMessages(messages),
		system: `تو فقط پاسخ نهایی را برای کاربر می‌نویسی.
فارسی، کوتاه و طبیعی حرف بزن.
درباره نقش Researcher یا Writer یا Reviewer چیزی نگو.
کلمه‌های Reviewer's response، Number، draft، matches را ننویس.
اگر سؤال سلام است، فقط سلام کن.
اگر سؤال از اسناد است، فقط از یادداشت محقق استفاده کن.
اگر فارسی سوال شد، فقط فارسی بنویس. اگر انگلیسی سوال شد، فقط انگلیسی بنویس. ایموجی نگذار.
اگر در یادداشت نبود بگو: در اسناد موجود پیدا نکردم.
جواب سلام فقط سلام چطور میتونم کمکت کنم؟ باشه. اگر سوالی بود بگو. اگر سوالی نبود بگو:سلام، چطور میتونم کمکتون کنم؟.
در جواب سلام بگو سلام
در جواب سلام نگو how can I help you?
در جواب hi بگو، Hi, how can I help you?
جواب را فقط فارسی بنویس. عدد را با رقم و کلمهٔ «میلیون تومان» بیاور.
fifty million نگو، بگو ۵۰ میلیون تومان

یادداشت محقق:
${researchNotes}

پیش‌نویس داخلی (فقط برای اصلاح؛ برای کاربر تکرار نکن):
${draft}`,
	})
	return result.toUIMessageStreamResponse()
})
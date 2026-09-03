import {
	convertToModelMessages,
	embed,
	streamText,
	tool,
	stepCountIs,
	type UIMessage,
} from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { z } from 'zod'
import { useServerSupabase } from '../utils/supabase'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

function toEnglishDigits(text: string) {
	const map: Record<string, string> = {
		'۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
		'۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
	}
	return text.replace(/[۰-۹]/g, (ch) => map[ch] ?? ch)
}

function extractPercent(text: string) {
	const normalized = toEnglishDigits(text)
	const match = normalized.match(/(\d+)\s*%|(\d+)\s*٪/)
	if (!match) return null
	return Number(match[1] || match[2])
}

function extractAmount(text: string) {
	const normalized = toEnglishDigits(text)
	const match = normalized.match(/(\d+(?:\.\d+)?)/)
	if (!match) return null
	return Number(match[1])
}

export default defineEventHandler(async (event) => {
	const { messages }: { messages: UIMessage[] } = await readBody(event)

	const lastText =
		[...messages]
			.reverse()
			.find((m) => m.role === 'user')
			?.parts
			?.filter((p) => p.type === 'text')
			.map((p) => (p as { text?: string }).text)
			.join(' ') ?? ''

	const needsDocuments = lastText.trim().length > 0

	let documentContext = ''

	if (needsDocuments) {
		const { embedding } = await embed({
			model: ollama.embedding('nomic-embed-text'),
			value: lastText,
		})

		const supabase = useServerSupabase()
		const { data } = await supabase.rpc('match_documents', {
			query_embedding: embedding,
			match_threshold: 0.1,
			match_count: 3,
		})

		documentContext = (data ?? [])
			.map((row: { content?: string }) => row.content)
			.filter(Boolean)
			.join('\n')

		const percent = extractPercent(lastText)
		const amount = extractAmount(documentContext)

		if (percent !== null && amount !== null && /تخفیف|درصد/.test(lastText)) {
			const finalAmount = amount * (1 - percent / 100)
			documentContext += `\nنتیجه محاسبه روی عدد پیدا شده در اسناد: ${finalAmount}`
		}
	}

	const result = streamText({
		model: ollama('qwen2.5:1.5b'),
		messages: await convertToModelMessages(messages),
		temperature: 0.1,
		stopWhen: stepCountIs(5),
		toolChoice: 'auto',
		activeTools: ['calculator'],
		system: `
به فارسی کوتاه جواب بده.
اگر اسناد مرتبط بود، فقط از همان‌ها استفاده کن.
اگر محاسبه لازم بود، از ابزار calculator استفاده کن.
اسناد:
اگر اسناد موجود بود، نگو اسناد را ببین. همان عدد را بگو.
${documentContext || 'موردی پیدا نشد'}
		`.trim(),
		tools: {
			calculator: tool({
				description: 'Calculate a math expression such as 23*47 or 50*0.9',
				inputSchema: z.object({
					expression: z.string(),
				}),
				execute: async ({ expression }) => {
					const map: Record<string, string> = {
						'۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
						'۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
						'×': '*', '÷': '/', 'x': '*', 'X': '*',
					}

					const normalized = expression
						.replace(/ضربدر/g, '*')
						.replace(/[۰-۹×÷xX]/g, (ch) => map[ch] ?? ch)

					const safe = normalized.replace(/[^0-9+\-*/().%\s]/g, '')
					if (!safe.trim()) {
						return { ok: false, message: 'invalid expression' }
					}

					const value = Function(`"use strict"; return (${safe})`)()
					return { ok: true, expression: safe, value }
				},
			}),
		},
	})

	return result.toUIMessageStreamResponse()
})
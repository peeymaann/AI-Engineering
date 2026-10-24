import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { createOllama } from 'ollama-ai-provider-v2'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

function getModel() {
	// اگر روی Vercel متغیر ست شده باشد → Gemini
	if (process.env.USE_GEMINI_EMBEDDING === 'true') {
		return google('gemini-3.8-flash')
	}

	// در غیر این صورت (لپ‌تاپ) → Ollama
	return ollama('gemma2:2b')
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const sensors = body?.sensors
	const isEnglish = body?.locale === 'en'

	if (!Array.isArray(sensors) || !sensors.length) {
		throw createError({
			statusCode: 400,
			statusMessage: 'sensors is required',
		})
	}

	const temp = Number(sensors.find((item) => item.key === 'temp')?.value)
	const humidity = Number(sensors.find((item) => item.key === 'humidity')?.value)
	const isCritical = temp > 30 || humidity > 70

	const level = isEnglish
		? (isCritical ? 'critical' : 'normal')
		: (isCritical ? 'بحرانی' : 'عادی')

	const lines = sensors
		.map((item) => `${item.label}: ${item.value}${item.unit ?? ''}`)
		.join('\n')

	const prompt = isEnglish
		? `You are a device maintenance assistant.
Status level is already decided: ${level}
Temperature: ${temp}
Humidity: ${humidity}

Data:
${lines}

Rules:
- Reply only in English.
- If level is "critical", start with "Warning" and say temperature or humidity is high.
- If level is "normal", start with "Normal" and say no action is needed now.
- Do not invent new numbers. Write 3 short sentences.`
		: `تو یک دستیار نگهداری دستگاه هستی.
سطح وضعیت از قبل مشخص شده: ${level}
دما: ${temp}
رطوبت: ${humidity}

داده:
${lines}

قانون:
- فقط به فارسی جواب بده.
- اگر سطح «بحرانی» است، با کلمه «هشدار» شروع کن و بگو دما یا رطوبت بالاست.
- اگر سطح «عادی» است، با کلمه «عادی» شروع کن و بگو فعلاً نیازی به اقدام نیست.
- عدد تازه نساز. ۳ جمله کوتاه بنویس.`

	const result = await generateText({
		model: getModel(),
		prompt,
	})

	return {
		ok: true,
		level,
		analysis: result.text,
	}
})
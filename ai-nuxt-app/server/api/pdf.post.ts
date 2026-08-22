import { embed } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { PDFParse } from 'pdf-parse'
import { useServerSupabaseAdmin } from '../utils/supabase-admin'

const ollama = createOllama({
	baseURL: 'http://localhost:11434/api',
})

export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event)
	const file = form?.find((item) => item.name === 'file')

	if (!file?.data) {
		throw createError({
			statusCode: 400,
			statusMessage: 'PDF file is required',
		})
	}

	const supabase = useServerSupabaseAdmin()
	const filename = `${Date.now()}-${file.filename || 'upload.pdf'}`


	// ۱) ذخیره خود فایل PDF
	// 1) Saving the PDF file itself

	const { error: storageError } = await supabase.storage
		.from('documents')
		.upload(filename, file.data, {
			contentType: 'application/pdf',
			upsert: false,
		})

	if (storageError) {
		throw createError({
			statusCode: 500,
			statusMessage: storageError.message,
		})
	}

	// ۲) استخراج متن
	// 2) Text extraction
	const parser = new PDFParse({ data: file.data })
	const parsed = await parser.getText()
	await parser.destroy()

	const text = parsed.text?.trim()
	if (!text) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No text found in PDF',
		})
	}

	// ۳) تکه‌تکه + Embedding + ذخیره در جدول
	// 3) Chunking + Embedding + Saving to table
	const chunkSize = 500
	const chunks: string[] = []
	for (let i = 0; i < text.length; i += chunkSize) {
		chunks.push(text.slice(i, i + chunkSize))
	}

	let saved = 0

	for (const chunk of chunks) {
		const { embedding } = await embed({
			model: ollama.embedding('nomic-embed-text'),
			value: chunk,
		})

		const { error } = await supabase.from('documents').insert({
			content: chunk,
			embedding,
			metadata: {
				source: 'pdf-upload',
				filename: file.filename || 'unknown.pdf',
				storage_path: filename,
			},
		})

		if (error) {
			throw createError({
				statusCode: 500,
				statusMessage: error.message,
			})
		}

		saved++
	}

	return {
		ok: true,
		saved,
		pages: parsed.total,
		storage_path: filename,
	}

})

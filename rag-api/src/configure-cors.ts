/* eslint-disable prettier/prettier */
import type { INestApplication } from '@nestjs/common'

const DEFAULT_ORIGINS = [
	'http://localhost:3000',
	'http://127.0.0.1:3000',
]

function extraOriginsFromEnv(): string[] {
	return (process.env.CORS_ORIGINS ?? '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean)
}

export function isAllowedCorsOrigin(origin: string): boolean {
	if (DEFAULT_ORIGINS.includes(origin) || extraOriginsFromEnv().includes(origin)) {
		return true
	}

	try {
		const url = new URL(origin)
		return url.hostname === 'localhost' || url.hostname === '127.0.0.1'
	} catch {
		return false
	}
}

export function configureCors(app: INestApplication): void {
	app.enableCors({
		origin: (origin, callback) => {
			if (!origin || isAllowedCorsOrigin(origin)) {
				callback(null, true)
				return
			}

			callback(null, false)
		},
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'x-vercel-ai-ui-message-stream',
		],
		exposedHeaders: ['x-vercel-ai-ui-message-stream'],
	})
}

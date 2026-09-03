/* eslint-disable prettier/prettier */
import { Controller, INestApplication, Module, Post, Res } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { Response } from 'express'
import request from 'supertest'
import { configureCors } from '../src/configure-cors'
import { existingResponseHeaders } from '../src/http/existing-response-headers'

@Controller()
class ChatRagCorsController {
	@Post('chat-rag')
	chat(@Res() res: Response) {
		// Mimic AI SDK pipeUIMessageStreamToResponse: writeHead replaces headers.
		res.writeHead(200, {
			...existingResponseHeaders(res),
			'content-type': 'text/event-stream',
		})
		res.end('data: ok\n\n')
	}
}

@Module({ controllers: [ChatRagCorsController] })
class ChatRagCorsModule {}

describe('CORS (e2e)', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [ChatRagCorsModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		configureCors(app)
		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	it('preflight OPTIONS /chat-rag includes Access-Control-Allow-Origin', async () => {
		await request(app.getHttpServer())
			.options('/chat-rag')
			.set('Origin', 'http://localhost:3000')
			.set('Access-Control-Request-Method', 'POST')
			.set('Access-Control-Request-Headers', 'content-type')
			.expect(204)
			.expect('Access-Control-Allow-Origin', 'http://localhost:3000')
			.expect('Access-Control-Allow-Credentials', 'true')
	})

	it('POST /chat-rag keeps Access-Control-Allow-Origin after writeHead', async () => {
		await request(app.getHttpServer())
			.post('/chat-rag')
			.set('Origin', 'http://localhost:3000')
			.set('Content-Type', 'application/json')
			.send({ messages: [] })
			.expect(200)
			.expect('Access-Control-Allow-Origin', 'http://localhost:3000')
			.expect('Content-Type', /text\/event-stream/)
	})
})

/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common'
import { pipeUIMessageStreamToResponse, type UIMessage } from 'ai'
import type { Response } from 'express'
import { RagService } from './rag.service'

@Controller()
export class RagController {
	constructor(private readonly ragService: RagService) { }

	@Post('documents')
	addDocument(@Body('content') content: string) {
		return this.ragService.addTextDocument(content)
	}

	@Post('search')
	search(@Body('query') query: string) {
		return this.ragService.search(query)
	}

	@Post('chat-rag')
	async chat(@Body('messages') messages: UIMessage[], @Res() res: Response) {
		if (!Array.isArray(messages) || messages.length === 0) {
			throw new BadRequestException('messages is required')
		}

		const stream = await this.ragService.chat(messages)

		await pipeUIMessageStreamToResponse({
			response: res,
			stream,
		})
	}
}
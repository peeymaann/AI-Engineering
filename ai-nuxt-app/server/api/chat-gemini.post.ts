import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';

export default defineEventHandler(async (event) => {
	const { messages }: { messages: UIMessage[] } = await readBody(event);

	const result = streamText({
		model: google('gemini-3.8-flash') as Parameters<typeof streamText>[0]['model'],
		messages: await convertToModelMessages(messages),
		temperature: 0.7,
	});

	return result.toUIMessageStreamResponse();
});

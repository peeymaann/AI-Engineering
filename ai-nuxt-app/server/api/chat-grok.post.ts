import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { xai } from '@ai-sdk/xai';

export default defineEventHandler(async (event) => {
	const { messages }: { messages: UIMessage[] } = await readBody(event);

	const result = streamText({
		model: xai('grok-4'), // یا grok-4-fast Translated > or grok-4-fast
		messages: await convertToModelMessages(messages),
		temperature: 0.7,
	});

	return result.toUIMessageStreamResponse();
});

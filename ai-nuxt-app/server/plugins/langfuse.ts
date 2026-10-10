import { NodeSDK } from '@opentelemetry/sdk-node'
import { LangfuseSpanProcessor } from '@langfuse/otel'

// Nitro loads every file in server/plugins and imports its default export.
// Starting the SDK at module scope leaves that export missing and Rollup fails.
export default defineNitroPlugin((nitroApp) => {
	const sdk = new NodeSDK({
		spanProcessors: [new LangfuseSpanProcessor()],
	})

	sdk.start()

	nitroApp.hooks.hookOnce('close', async () => {
		await sdk.shutdown()
	})
})
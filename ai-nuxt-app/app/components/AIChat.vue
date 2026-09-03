<template>
	<div class="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-4 p-1 sm:gap-5 sm:p-2">
		<!-- Header -->
		<div
			class="relative z-50 shrink-0 flex flex-col gap-4 rounded-2xl border border-default bg-elevated/50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
			<div class="text-start">
				<h1 id="chat-heading" class="text-xl font-bold text-highlighted">
					چت با هوش مصنوعی
				</h1>
				<p class="mt-1 text-sm text-muted">
					پیام بفرستید و پاسخ را به صورت زنده دریافت کنید
				</p>
			</div>

			<div class="relative z-50 flex items-center gap-2">
				<UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm"
					:disabled="!messages.length || loading" @click="clearChat">
					پاک کردن
				</UButton>

				<USelect
					class="relative z-50 w-full sm:w-52"
					v-model="selectedApi"
					:items="apiOptions"
					value-key="value"
					:portal="false"
					:disabled="loading"
					aria-label="انتخاب مدل هوش مصنوعی"
					:ui="{ content: 'z-[100]' }"
				/>
			</div>
		</div>

		<!-- Chat panel: fills remaining height; only messages scroll -->
		<div
			class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-default bg-default shadow-md">

			<!-- Messages area (single scroll container) -->
			<div
				class="min-h-0 flex-1 overflow-y-auto overscroll-contain"
				tabindex="0"
				role="log"
				aria-label="گفتگو"
				aria-live="polite"
			>
				<!-- Empty state -->
				<div v-if="!messages.length"
					class="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
					<div class="rounded-full bg-elevated p-4">
						<UIcon name="i-lucide-message-circle" class="size-8 text-muted" />
					</div>
					<div>
						<p class="font-medium text-highlighted">هنوز پیامی نیست</p>
						<p class="mt-1 text-sm text-muted">یک سوال بپرسید تا گفتگو شروع شود</p>
					</div>
				</div>

				<!-- Messages -->
				<UChatMessages v-else :messages="messages" :status="status" :should-auto-scroll="true"
					class="p-4 sm:p-5 [&>article]:last-of-type:min-h-0" :user="{
						side: 'right',
						variant: 'soft',
						avatar: { icon: 'i-lucide-user' },
					}" :assistant="{
						side: 'left',
						variant: 'naked',
						avatar: { icon: 'i-lucide-bot' },
					}">
					<template #indicator>
						<div class="flex items-center gap-2 text-sm text-muted">
							<UIcon name="i-lucide-loader-2" class="size-4 animate-spin" />
							<span>در حال پاسخ ...</span>
						</div>
					</template>
				</UChatMessages>
			</div>

			<!-- Input area: never scrolls with the messages -->
			<div class="shrink-0 overflow-hidden border-t border-default bg-elevated/30 p-2">
				<!-- Client-only: browser form restoration mutates the textarea before hydration. -->
				<ClientOnly>
					<UChatPrompt
						v-model="input"
						placeholder="پیام خود را بنویسید…"
						:error="error"
						variant="naked"
						class="bg-transparent"
						:ui="{ root: 'p-0 gap-0', body: 'w-full min-w-0' }"
						@submit="onSubmit"
					>
						<template #body="{ placeholder, disabled, submit }">
							<UTextarea
								id="chat-prompt"
								name="chat-prompt"
								v-model="input"
								:placeholder="placeholder"
								:disabled="disabled"
								variant="none"
								fixed
								autoresize
								:rows="1"
								autocomplete="off"
								aria-label="پیام چت"
								class="w-full min-w-0"
								@keydown="onPromptKeydown($event, submit)"
							>
								<template #trailing>
									<UChatPromptSubmit :status="status" @stop="stop()" @reload="regenerate()" />
								</template>
							</UTextarea>
						</template>
					</UChatPrompt>
					<template #fallback>
						<div
							class="flex min-h-10 w-full items-center text-base/5 text-muted"
							aria-hidden="true"
						>
							پیام خود را بنویسید…
						</div>
					</template>
				</ClientOnly>
			</div>
		</div>
	</div>

</template>

<script setup>
import { useChat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const input = ref('')
const chatStore = useChatStore()
const { selectedApi, apiOptions, savedMessages } = storeToRefs(chatStore)

const { messages, sendMessage, status, error, stop, regenerate, setMessages } = useChat(() => ({
	transport: new DefaultChatTransport({ api: selectedApi.value }),
}))

const loading = computed(() => status.value === 'submitted' || status.value === 'streaming')

onMounted(() => {
	chatStore.loadMessages()

	if (savedMessages.value.length) {
		// اگر setMessages وجود داشت از آن استفاده کن
		if (typeof setMessages === 'function') {
			setMessages(savedMessages.value)
		} else {
			// روش جایگزین
			messages.value = savedMessages.value
		}
	}
})

// ذخیره خودکار هر بار که پیام‌ها تغییر کنند
watch(
	messages,
	(newMessages) => {
		chatStore.saveMessages(newMessages)
	},
	{ deep: true }
)

function onPromptKeydown(event, submit) {
	if (event.key !== 'Enter') return
	if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
	if (event.isComposing || event.keyCode === 229) return
	event.preventDefault()
	submit(event)
}

function onSubmit() {
	const text = input.value.trim()
	if (!text || loading.value) return
	input.value = ''
	sendMessage({ text })
}

function clearChat() {
	messages.value = []
	chatStore.clearMessages()
}
</script>

<template>
	<div class="rounded-2xl border border-default bg-default p-4 shadow-sm transition-colors hover:bg-default/50">
		<h2 id="docs-heading" class="text-base font-semibold text-highlighted">{{ t("addDocument") }}</h2>
		<p class="mt-1 text-sm text-muted">
			{{ t("ragText") }}
		</p>

		<textarea
			v-model="content"
			name="document-content"
			autocomplete="off"
			rows="5"
			class="mt-3 w-full resize-none rounded-xl border border-default bg-elevated/30 p-3 text-sm outline-none focus:border-primary"
			:placeholder="t('writeDocument')"
			:disabled="loading"
		/>

		<div class="mt-3 flex flex-wrap items-center gap-3">
			<UButton :loading="loading" :disabled="!content.trim() || loading" @click="upload">
				{{ t("saveText") }}
			</UButton>

			<label class="inline-flex cursor-pointer">
				<input
					type="file"
					accept="application/pdf"
					class="hidden"
					:disabled="loading"
					@change="onPdfChange"
				>
				<UButton as="span" color="neutral" variant="outline" :loading="loading" :disabled="loading">
					{{ t("uploadPdf") }}
				</UButton>
			</label>

			<p v-if="status" class="text-sm" :class="status.ok ? 'text-green-600' : 'text-red-600'">
				{{ status.text }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">

const { t } = useI18n()
const content = ref('')
const loading = ref(false)
const status = ref<{ ok: boolean; text: string } | null>(null)

async function upload() {
	const text = content.value.trim()
	if (!text) return

	loading.value = true
	status.value = null

	try {
		const { saved } = await $fetch<{ saved: number }>('/api/documents', {
			method: 'POST',
			body: { content: text },
		})
		status.value = { ok: true, text: `${saved} بخش ذخیره شد` }
		content.value = ''
	} catch (e: any) {
		status.value = {
			ok: false,
			text: e?.data?.statusMessage || e?.message || 'خطا در ذخیره',
		}
	} finally {
		loading.value = false
	}
}

async function onPdfChange(e: Event) {
	const input = e.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file) return

	loading.value = true
	status.value = null

	try {
		const form = new FormData()
		form.append('file', file)

		const { saved, pages } = await $fetch<{ saved: number; pages: number }>('/api/pdf', {
			method: 'POST',
			body: form,
		})

		status.value = {
			ok: true,
			text: `${saved} بخش از PDF (${pages} صفحه) ذخیره شد`,
		}
	} catch (err: any) {
		status.value = {
			ok: false,
			text: err?.data?.statusMessage || err?.message || 'خطا در ذخیره PDF',
		}
	} finally {
		input.value = ''
		loading.value = false
	}
}
</script>

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
			<UButton :loading="loading" :disabled="!signedIn || !content.trim() || loading" @click="upload">
				{{ t("saveText") }}
			</UButton>

			<label
				class="inline-flex"
				:class="signedIn && !loading ? 'cursor-pointer' : 'cursor-not-allowed'"
				:aria-disabled="!signedIn || loading ? 'true' : undefined"
			>
				<input
					type="file"
					accept="application/pdf"
					class="hidden"
					:disabled="!signedIn || loading"
					@change="onPdfChange"
				>
				<UButton
					as="span"
					color="neutral"
					variant="outline"
					:loading="loading"
					:disabled="!signedIn || loading"
					:class="signedIn ? undefined : 'opacity-75'"
				>
					{{ t("uploadPdf") }}
				</UButton>
			</label>

			<p v-if="status" role="status" class="text-sm" :class="status.ok ? 'text-green-600' : 'text-red-600'">
				{{ statusText }}
			</p>
		</div>

		<section v-if="showMyDocuments" class="mt-6 space-y-3" aria-labelledby="my-docs-heading">
			<h3 id="my-docs-heading" class="text-sm font-medium text-highlighted">
				{{ t("myDocuments") }}
			</h3>
			<p v-if="listStatus" class="text-sm text-red-600">{{ listStatus }}</p>

			<div class="max-h-[40vh] space-y-3 overflow-y-auto pe-1">
				<article
					v-for="doc in docs"
					:key="doc.id"
					class="flex items-start justify-between gap-3 rounded-xl border border-default p-3"
				>
					<p class="text-sm">{{ doc.content.slice(0, 180) }}</p>
					<UButton size="xs" color="error" variant="ghost" @click="removeDoc(doc.id)">
						{{ t("delete") }}
					</UButton>
				</article>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const content = ref('')
const loading = ref(false)
const user = useSupabaseUser()
const supabase = useSupabaseClient()

type Status =
	| { ok: true; key: 'chunksSaved'; count: number }
	| { ok: true; key: 'pdfChunksSaved'; saved: number; pages: number }
	| { ok: false; key: 'saveFailed' | 'pdfSaveFailed' }
	| { ok: false; text: string }

type DocRow = {
	id: number
	content: string
}

const status = ref<Status | null>(null)
const docs = ref<DocRow[]>([])
const listStatus = ref('')
const signedIn = computed(() => Boolean(user.value))
const showMyDocuments = computed(() => signedIn.value && docs.value.length > 0)

const statusText = computed(() => {
	const current = status.value
	if (!current) return ''
	if ('text' in current) return current.text
	if (current.key === 'chunksSaved') return t('chunksSaved', { count: current.count })
	if (current.key === 'pdfChunksSaved') return t('pdfChunksSaved', { saved: current.saved, pages: current.pages })
	return t(current.key)
})

function readError(err: unknown) {
	if (!err || typeof err !== 'object') return ''

	if ('data' in err && err.data && typeof err.data === 'object' && 'statusMessage' in err.data && typeof err.data.statusMessage === 'string') {
		return err.data.statusMessage
	}

	if ('statusMessage' in err && typeof err.statusMessage === 'string') return err.statusMessage
	if ('message' in err && typeof err.message === 'string') return err.message
	return ''
}

async function currentUserId() {
	if (!user.value) return null
	if (typeof user.value.sub === 'string' && user.value.sub) return user.value.sub

	const { data } = await supabase.auth.getSession()
	return data.session?.user?.id ?? null
}

async function loadDocs() {
	const userId = await currentUserId()
	if (!userId) {
		docs.value = []
		listStatus.value = ''
		return
	}

	const { data, error } = await supabase
		.from('documents')
		.select('id, content')
		.eq('user_id', userId)
		.order('id', { ascending: false })

	if (error) {
		listStatus.value = error.message
		return
	}

	docs.value = data ?? []
	listStatus.value = ''
}

async function upload() {
	const text = content.value.trim()
	if (!text || loading.value) return

	loading.value = true
	status.value = null

	try {
		const userId = await currentUserId()
		if (!userId) return

		const { saved } = await $fetch<{ saved: number }>('/api/documents', {
			method: 'POST',
			body: { content: text, user_id: userId },
		})

		status.value = { ok: true, key: 'chunksSaved', count: saved }
		content.value = ''
		await loadDocs()
	} catch (err: unknown) {
		const message = readError(err)
		status.value = message ? { ok: false, text: message } : { ok: false, key: 'saveFailed' }
	} finally {
		loading.value = false
	}
}

async function onPdfChange(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file || loading.value) return

	loading.value = true
	status.value = null

	try {
		const userId = await currentUserId()
		if (!userId) return

		const form = new FormData()
		form.append('file', file)
		form.append('user_id', userId)

		const { saved, pages } = await $fetch<{ saved: number; pages: number }>('/api/pdf', {
			method: 'POST',
			body: form,
		})

		status.value = { ok: true, key: 'pdfChunksSaved', saved, pages }
		await loadDocs()
	} catch (err: unknown) {
		const message = readError(err)
		status.value = message ? { ok: false, text: message } : { ok: false, key: 'pdfSaveFailed' }
	} finally {
		input.value = ''
		loading.value = false
	}
}

async function removeDoc(id: number) {
	const userId = await currentUserId()
	if (!userId) return

	const { error } = await supabase
		.from('documents')
		.delete()
		.eq('id', id)
		.eq('user_id', userId)

	if (error) {
		listStatus.value = error.message
		return
	}

	listStatus.value = ''
	await loadDocs()
}

watch(user, () => {
	loadDocs()
}, { immediate: true })
</script>
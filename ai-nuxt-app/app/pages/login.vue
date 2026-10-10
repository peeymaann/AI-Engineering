<template>
	<main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-4 p-6">
		<h1 class="text-xl font-bold">{{ t('login') }}</h1>
		<p class="text-sm text-muted">{{ t('loginHint') }}</p>

		<UInput v-model="email" type="email" placeholder="email@example.com" />
		<UInput v-model="password" type="password" :placeholder="t('passwordHint')" />

		<p v-if="message" class="text-sm">{{ message }}</p>

		<div class="flex gap-2">
			<UButton :loading="loading" @click="signUp">{{ t('signUp') }}</UButton>
			<UButton color="neutral" :loading="loading" @click="signIn">{{ t('login') }}</UButton>
		</div>
	</main>
</template>

<script setup>
const { t } = useI18n()
const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

async function signUp() {
	loading.value = true
	message.value = ''
	const { error } = await client.auth.signUp({
		email: email.value.trim(),
		password: password.value,
	})
	loading.value = false
	message.value = error ? error.message : t('signUpDone')
}

async function signIn() {
	loading.value = true
	message.value = ''
	const { error } = await client.auth.signInWithPassword({
		email: email.value.trim(),
		password: password.value,
	})
	loading.value = false
	if (error) {
		message.value = error.message
		return
	}
	await navigateTo('/')
}
</script>
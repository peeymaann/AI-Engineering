<template>
	<main
		class="mx-auto flex h-dvh w-full max-w-6xl flex-col gap-4 overflow-hidden bg-muted/30 px-4 py-4 sm:flex-row sm:py-6"
	>
		<aside
			class="w-full shrink-0 sm:w-80 sm:self-start"
			aria-labelledby="docs-heading"
		>
			<div class="mb-3 flex justify-between sm:justify-start cursor-pointer gap-2">
				<UButton to="/iot" icon="i-lucide-activity" variant="soft">
				{{ t("iotDashboard") }}
				</UButton>
				<UFieldGroup>
					<UButton variant="soft" @click="toggleLocale">
						{{ locale === 'fa' ? 'FA' : 'EN' }}
					</UButton>
					<UButton color="error" @click="toggleLocale">
						{{ locale === 'fa' ? 'زبان' : 'Language' }}
					</UButton>
				</UFieldGroup>
			</div>
			<DocumentUpload />
		</aside>

		<section class="min-h-0 w-full flex-1" aria-labelledby="chat-heading">
			<AIChat />
		</section>
	</main>
</template>

<script setup>

const { locale, setLocale, t } = useI18n()

function toggleLocale() {
	setLocale(locale.value === 'fa' ? 'en' : 'fa')
}
</script>
<template>
	<main class="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
		<div class="flex items-start justify-between gap-3">
			<div>
				<h1 class="text-xl font-bold text-highlighted">{{ t('iotDashboard') }}</h1>
				<p class="mt-1 text-sm text-muted">{{ t('iotHint') }}</p>
			</div>
			<UButton to="/" variant="ghost" icon="i-lucide-arrow-right">
				{{ t('backToChat') }}
			</UButton>
		</div>

		<div class="flex flex-wrap gap-2">
			<UButton variant="soft" @click="setNormal">{{ t('normalData') }}</UButton>
			<UButton color="warning" variant="soft" @click="setCritical">{{ t('criticalData') }}</UButton>
		</div>

		<div class="grid gap-4 sm:grid-cols-3">
			<UCard v-for="item in sensors" :key="item.key">
				<template #header>
					<p class="text-sm text-muted">{{ item.label }}</p>
				</template>
				<p class="text-2xl font-semibold">{{ item.value }}{{ item.unit }}</p>
			</UCard>
		</div>

		<div>
			<UButton :loading="loading" icon="i-lucide-sparkles" @click="analyze">
				{{ t('analyze') }}
			</UButton>
		</div>

		<UAlert v-if="errorMessage" color="error" :title="errorMessage" />

		<UCard v-if="analysis">
			<template #header>
				<p class="text-sm text-muted">{{ t('analysisResult') }}</p>
				<p class="text-sm text-muted">{{ t('level') }}: {{ level }}</p>
			</template>
			<p class="whitespace-pre-wrap text-sm">{{ analysis }}</p>
		</UCard>
	</main>
</template>

<script setup>

const { t, locale } = useI18n()

const mode = ref('normal')
const analysis = ref('')
const level = ref('')
const loading = ref(false)
const errorMessage = ref('')

const sensors = computed(() => {
	if (mode.value === 'critical') {
		return [
			{ key: 'temp', label: t('temp'), value: 36, unit: '°C' },
			{ key: 'humidity', label: t('humidity'), value: 82, unit: '%' },
			{ key: 'status', label: t('deviceStatus'), value: t('on'), unit: '' },
		]
	}

	return [
		{ key: 'temp', label: t('temp'), value: 27, unit: '°C' },
		{ key: 'humidity', label: t('humidity'), value: 63, unit: '%' },
		{ key: 'status', label: t('deviceStatus'), value: t('on'), unit: '' },
	]
})

function setNormal() {
	mode.value = 'normal'
	analysis.value = ''
	level.value = ''
}

function setCritical() {
	mode.value = 'critical'
	analysis.value = ''
	level.value = ''
}

async function analyze() {
	errorMessage.value = ''
	analysis.value = ''
	level.value = ''
	loading.value = true
	try {
		const data = await $fetch('/api/iot-analyze', {
			method: 'POST',
			body: {
				sensors: sensors.value,
				locale: locale.value,
			},
		})
		level.value = data.level
		analysis.value = data.analysis
	} catch (error) {
		errorMessage.value = error?.data?.statusMessage || t('analyzeFailed')
	} finally {
		loading.value = false
	}
}
</script>
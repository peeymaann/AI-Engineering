// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	modules: [
		'@nuxt/ui',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxt/a11y',
	],

	css: ['~/assets/css/main.css'],

	app: {
		head: {
			htmlAttrs: {
				lang: 'fa',
				dir: 'rtl',
			},
			title: 'چت با Ollama| Chat with Ollama',
		},
	},

	// تنظیمات اضافی برای AI و Nitro
	// Additional settings for AI and Nitro
	nitro: {
		experimental: {
			openAPI: true,
		},
	},

	// Pre-bundle client AI SDK deps to avoid runtime discovery reloads
	vite: {
		optimizeDeps: {
			include: ['@ai-sdk/vue'],
		},
	},

	runtimeConfig: {
		supabaseUrl: '',
		supabaseAnonKey: '',
		supabaseServiceRoleKey: '',
	},
})

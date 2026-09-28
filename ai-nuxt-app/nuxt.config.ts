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
		'@nuxtjs/i18n',
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

	i18n: {
		locales: [
			{ code: 'fa', language: 'fa-IR', name: 'فارسی', dir: 'rtl' },
			{ code: 'en', language: 'en-US', name: 'English', dir: 'ltr' },
		],
		defaultLocale: 'fa',
		strategy: 'no_prefix',
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			alwaysRedirect: false,
			fallbackLocale: 'fa',
		},
		vueI18n: './i18n.config.ts',
	},
})

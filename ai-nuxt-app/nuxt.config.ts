// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	compatibilityDate: '2026-10-04',
	devtools: { enabled: false },

	modules: [
		'@nuxt/ui',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxtjs/supabase',
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

	// .env stores NUXT_SUPABASE_URL and NUXT_SUPABASE_ANON_KEY.
	// @nuxtjs/supabase only reads NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_KEY,
	// and its plugin throws before Pinia is installed when those are empty.
	supabase: {
		url: process.env.NUXT_SUPABASE_URL,
		key: process.env.NUXT_SUPABASE_ANON_KEY,
		redirect: false,
		// ~/ is the app/ directory. Without this file the module types
		// Database as unknown, and .insert() then expects never[].
		types: '~/types/database.types.ts',
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

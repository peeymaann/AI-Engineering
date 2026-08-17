import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", () => {
	const selectedApi = ref("/api/chat");
	const apiOptions = ref([
		{ label: "Ollama (محلی)", value: "/api/chat", icon: "i-lucide-server" },
		{ label: "Grok (xAI)", value: "/api/chat-grok", icon: "i-lucide-sparkles" },
		{ label: 'RAG (اسناد)', value: '/api/chat-rag', icon: 'i-lucide-file-search' },
		{ label: 'RAG (NestJS)', value: 'http://localhost:3002/api/chat-rag', icon: 'i-lucide-network' },
	]);

	// تاریخچه پیام‌ها
	const savedMessages = ref<any[]>([]);

	// بارگذاری از localStorage
	function loadMessages() {
		if (import.meta.client) {
			const data = localStorage.getItem("chat-messages");
			if (data) {
				savedMessages.value = JSON.parse(data);
			}
		}
	}

	// ذخیره در localStorage
	function saveMessages(messages: any[]) {
		if (import.meta.client) {
			savedMessages.value = messages;
			localStorage.setItem("chat-messages", JSON.stringify(messages));
		}
	}

	// پاک کردن تاریخچه
	function clearMessages() {
		savedMessages.value = [];
		if (import.meta.client) {
			localStorage.removeItem("chat-messages");
		}
	}

	function setApi(api: string) {
		selectedApi.value = api;
	}

	return {
		selectedApi,
		apiOptions,
		savedMessages,
		loadMessages,
		saveMessages,
		clearMessages,
		setApi,
	};
});

import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", () => {
	const isVercel = process.env.USE_GEMINI_EMBEDDING === 'true' || process.env.VERCEL === '1'

	const selectedApi = ref(isVercel ? "/api/chat-gemini" : "/api/chat");

	const apiOptions = ref(
		isVercel
			? [
				{ label: "Gemini", value: "/api/chat-gemini", icon: "i-lucide-sparkles" },
				{ label: 'RAG (اسناد)', value: '/api/chat-rag', icon: 'i-lucide-file-search' },
				{ label: 'Agent (ابزارها)', value: '/api/chat-agent', icon: 'i-lucide-bot' },
				{ label: 'Multi-Agent', value: '/api/chat-multi', icon: 'i-lucide-users' },
			]
			: [
				{ label: "Ollama (محلی)", value: "/api/chat", icon: "i-lucide-server" },
				{ label: "Gemini", value: "/api/chat-gemini", icon: "i-lucide-sparkles" },
				{ label: 'RAG (اسناد)', value: '/api/chat-rag', icon: 'i-lucide-file-search' },
				{ label: 'RAG (NestJS)', value: 'http://localhost:3002/chat-rag', icon: 'i-lucide-network' },
				{ label: 'Agent (ابزارها)', value: '/api/chat-agent', icon: 'i-lucide-bot' },
				{ label: 'Multi-Agent', value: '/api/chat-multi', icon: 'i-lucide-users' },
			]
	);

	const savedMessages = ref<any[]>([]);

	function loadMessages() {
		if (import.meta.client) {
			const data = localStorage.getItem("chat-messages");
			if (data) {
				savedMessages.value = JSON.parse(data);
			}
		}
	}

	function saveMessages(messages: any[]) {
		if (import.meta.client) {
			savedMessages.value = messages;
			localStorage.setItem("chat-messages", JSON.stringify(messages));
		}
	}

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
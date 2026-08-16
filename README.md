# AI Engineering

[English](./README.md) | [فارسی](./README.fa.md)

A step-by-step learning path for becoming an AI Engineer using a modern TypeScript stack.

This repository follows a weekly roadmap. Each major milestone is saved with Git tags so you can review progress stage by stage.

## Stack

- **Frontend:** Nuxt 4, Vue 3, TypeScript, Nuxt UI
- **AI SDK:** Vercel AI SDK (`ai`, `@ai-sdk/vue`)
- **Local LLM:** Ollama (`gemma2:2b`, `nomic-embed-text`)
- **Cloud LLM:** xAI Grok
- **Vector Database:** Supabase (PostgreSQL + `pgvector`)
- **Backend:** NestJS
- **Storage:** Supabase Storage

## Repository Structure

```text
AI-Engineering/
├── ai-nuxt-app/     # Nuxt frontend + Nitro APIs
├── rag-api/         # NestJS RAG backend
├── README.md        # English version
└── README.fa.md     # Persian version

How to Run

1) Nuxt app

Bashcd ai-nuxt-app
pnpm install
pnpm dev
App: http://localhost:3000

2) NestJS API

Bashcd rag-api
pnpm install
pnpm start:dev
API: http://localhost:3002

3) Ollama
Make sure Ollama is running and models are available:
Bashollama list
Required models used in this path:

gemma2:2b
nomic-embed-text

Environment Variables
Never commit real .env files.
ai-nuxt-app/.env
envNUXT_SUPABASE_URL=
NUXT_SUPABASE_ANON_KEY=
NUXT_SUPABASE_SERVICE_ROLE_KEY=
XAI_API_KEY=
rag-api/.env
envSUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OLLAMA_BASE_URL=http://localhost:11434/api
PORT=3002

Weekly Roadmap

Week 1 — AI Chat Foundations

Set up Nuxt project
Install and use Vercel AI SDK
Learn streamText and chat streaming
Build a simple chat UI
Connect local Ollama model
Optional cloud model switch (Grok)

Focus: understand streaming chat end-to-end.

Week 2 — Better Chat UX + State

Improve chat UI with Nuxt UI
Use useChat
Add model/API switching
Manage state with Pinia
Persist chat history in localStorage
Clear chat and restore after refresh

Focus: production-like chat experience.

Week 3–4 — Prompting and Backend Discipline

System prompts
Cleaner API handlers in Nitro
Error handling and loading states
Git workflow: commit, tag, release notes

Focus: stable chat architecture before RAG.

Week 5–6 — RAG (Retrieval-Augmented Generation)

Learn vector embeddings
Set up Supabase + pgvector
Create documents table
Generate embeddings with nomic-embed-text
Build similarity search (match_documents)
Connect retrieved context to chat (/api/chat-rag)
Upload plain text documents
Upload PDF, extract text, chunk, embed
Store original PDF in Supabase Storage

Focus: chat with your own documents.

Week 7 — NestJS Backend for RAG

Create NestJS project (rag-api)
Connect NestJS to Supabase
Implement:
POST /rag/documents
POST /rag/search
POST /rag/chat

Keep Nuxt APIs working in parallel
Switch frontend between Nuxt API and NestJS API
Improve retrieval quality with similarity threshold

Focus: separate frontend and backend cleanly.

Week 8+ — Next Steps (planned)

API route unification between Nuxt and NestJS
Better document management UI
Auth and per-user documents
Agents / tool calling
Observability (for example Langfuse)
Deployment

Useful API Endpoints
Nuxt (localhost:3000)

POST /api/chat
POST /api/chat-grok
POST /api/chat-rag
POST /api/search
POST /api/documents
POST /api/pdf

NestJS (localhost:3002)

POST /rag/documents
POST /rag/search
POST /rag/chat

Git Tags (Milestones)
Examples used in this learning path:

v0.1.0-week1
v0.2.0-week2
v0.5.0-rag
v0.5.0-before-monorepo
v0.6.0-monorepo

Check a specific stage:
Bashgit checkout v0.5.0-rag
Return to latest:
Bashgit checkout main
Learning Goal
Move from Full Stack Developer skills (Nuxt/TypeScript) toward AI Engineering by building:

Streaming LLM chat
Model switching
RAG over private documents
Vector search
A dedicated NestJS AI backend

Notes

This repository is for learning and portfolio progress.
Local models are intentionally small for speed and lower hardware needs.
Cloud models (like Grok) are optional for comparison.
Service role keys must stay only on the server.

Author
Learning repository for AI Engineering practice with Nuxt, Vercel AI SDK, Supabase, Ollama, and NestJS.
```

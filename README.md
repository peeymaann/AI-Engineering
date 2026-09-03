# 🚀 AI Engineering

[English](./README.md) | [فارسی](./README.fa.md)

> A practical, 8-week roadmap for becoming an **AI Engineer** with a modern TypeScript stack.

Build real projects step by step: streaming chat → RAG → NestJS → agents → IoT dashboard → auth → deploy.

---

## ✨ What is this repository?

This is a **hands-on learning repository**, not an empty template.

Inside you will find:

- ✅ A working Nuxt chat app with Ollama + Grok
- ✅ RAG pipeline with Supabase + embeddings
- ✅ PDF/text document upload
- ✅ NestJS API for search, documents, and RAG chat
- ✅ Git tags for each major milestone
- 🚧 Agents, IoT dashboard, auth, observability, and deploy (weeks 4–8)

---

## 🛠️ Stack

| Area         | Tools                                             |
| ------------ | ------------------------------------------------- |
| 🖥️ Frontend  | Nuxt 4, Vue 3, TypeScript, Nuxt UI, Pinia, VueUse |
| 🤖 AI SDK    | Vercel AI SDK (`ai`, `@ai-sdk/vue`)               |
| 🏠 Local LLM | Ollama (`gemma2:2b`, `nomic-embed-text`)          |
| ☁️ Cloud LLM | xAI Grok                                          |
| 🗄️ Vector DB | Supabase (PostgreSQL + `pgvector`)                |
| 🧩 Backend   | NestJS                                            |
| 📁 Files     | Supabase Storage                                  |

---

## 📂 Repository Structure

```text
AI-Engineering/
├── 📁 ai-nuxt-app/   # Nuxt frontend + Nitro APIs
├── 📁 rag-api/       # NestJS RAG backend
├── 📄 README.md      # English
└── 📄 README.fa.md   # Persian
```

---

## ▶️ How to Run

### 1️⃣ Nuxt app

```bash
cd ai-nuxt-app
pnpm install
pnpm dev
```

🌐 App: [http://localhost:3000](http://localhost:3000)

### 2️⃣ NestJS API

```bash
cd rag-api
pnpm install
pnpm start:dev
```

🔌 API: [http://localhost:3002](http://localhost:3002)

### 3️⃣ Ollama

```bash
ollama list
```

Required models:

- `gemma2:2b`
- `nomic-embed-text`

---

## 🔐 Environment Variables

> ⚠️ Never commit real `.env` files.

### `ai-nuxt-app/.env`

```env
NUXT_SUPABASE_URL=
NUXT_SUPABASE_ANON_KEY=
NUXT_SUPABASE_SERVICE_ROLE_KEY=
XAI_API_KEY=
```

### `rag-api/.env`

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OLLAMA_BASE_URL=http://localhost:11434/api
PORT=3002
```

Later weeks may add keys for Langfuse. Keep those in `.env` as well.

---

## 🗺️ Weekly Roadmap

### 📅 Week 1 — Chat + Vercel AI SDK + Ollama / Grok

- Set up the Nuxt project
- Install and use Vercel AI SDK
- Learn `streamText` and chat streaming
- Connect local Ollama (`gemma2:2b`)
- Optional cloud switch to Grok

🎯 **Focus:** streaming chat from UI to model and back.

### 📅 Week 2 — UI + Pinia + History + Git

- Professional chat UI with Nuxt UI
- State with Pinia and VueUse
- Persist chat history in `localStorage`
- Clear chat and restore after refresh
- Git workflow: commit, tag, release notes

🎯 **Focus:** a production-like chat experience.

### 📅 Week 3 — RAG + Embedding + PDF + Nest + API Switch

- Supabase + `pgvector`
- Embeddings with `nomic-embed-text`
- Similarity search and `/api/chat-rag`
- Upload text and PDF, chunk, embed, store files
- NestJS backend (`rag-api`)
- Endpoints: `POST /documents`, `POST /search`, `POST /chat-rag`
- Switch the frontend between Nuxt API and NestJS API

🎯 **Focus:** chat with your own documents, with frontend and backend separated.

### 📅 Week 4 — Tool Calling + Simple Agent

- Learn **Tool Calling**: the model does not only write text; it can request a tool, get the result, then answer
- Add a `calculator` tool for math
- Add a `searchDocuments` tool for RAG / your own documents
- Build one simple Agent that can choose and use both tools
- New API: `POST /api/chat-agent`

🎯 **Focus:** Understand Tool Calling, then wrap it in one simple Agent + The model should call tools when needed, then answer.

### 📅 Week 5 — Simple Multi-Agent

- Learn **Multi-Agent**: instead of one model doing everything, a few small roles work in sequence
- Researcher: finds facts from documents or tools
- Writer: turns those facts into a clear answer
- Reviewer: checks the answer and fixes mistakes
- Keep it small: one learning example, not a large production system

🎯 **Focus:** split work across simple roles, not a large system.

### 📅 Week 6 — IoT AI Dashboard

- Show sensor data on a dashboard
- Smart analysis of sensor data
- Professional UI with Pinia / VueUse / Nuxt
- Connect the dashboard to the NestJS backend

🎯 **Focus:** show data and let AI explain it.

### 📅 Week 7 — Short Auth + Conceptual Observability

- Short authentication and basic security
- Introduction to per-user documents
- Conceptual Langfuse / logging

🎯 **Focus:** understand auth and traces, not a full production platform.

### 📅 Week 8 — Deploy + Final README

- Final Optimizations and tests
- Deploy on Vercel
- Final README, tags, resume and portfolio notes

🎯 **Focus:** a project you can show.

---

## 📡 Useful API Endpoints

### Nuxt (`localhost:3000`)

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/api/chat`      | Local Ollama chat |
| POST   | `/api/chat-grok` | Grok cloud chat   |
| POST   | `/api/chat-rag`  | RAG chat (Nuxt)   |
| POST   | `/api/search`    | Similarity search |
| POST   | `/api/documents` | Upload text       |
| POST   | `/api/pdf`       | Upload PDF        |

### NestJS (`localhost:3002`)

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| POST   | `/documents` | Upload text       |
| POST   | `/search`    | Similarity search |
| POST   | `/chat-rag`  | RAG chat (NestJS) |

---

## 🏷️ Git Tags (Milestones)

- `v0.1.0-week1`
- `v0.2.0-week2`
- `v0.5.0-rag`
- `v0.5.0-before-monorepo`
- `v0.6.0-monorepo`
  ...

Check a specific stage:

```bash
git checkout v0.5.0-rag
```

Return to latest:

```bash
git checkout main
```

---

## 🎯 Learning Goal

Move from Full Stack skills (Nuxt / TypeScript) toward AI Engineering by building:

1. 💬 Streaming LLM chat
2. 🔄 Model switching
3. 📚 RAG over private documents
4. 🔍 Vector search
5. 🧱 A dedicated NestJS AI backend
6. 🛠️ Tool calling and a simple agent
7. 📡 An IoT dashboard with AI analysis
8. 🔐 Short auth, observability, and deployment

---

## 📝 Notes

- This repository is for **learning and portfolio progress**
- Local models are intentionally small for speed and lower hardware needs
- Cloud models (like Grok) are optional for comparison
- Service role keys must stay only on the server
- Week 7 is an introduction, not a full production auth/observability stack

---

## 👤 Author

Learning repository for AI Engineering practice with **Nuxt**, **Vercel AI SDK**, **Supabase**, **Ollama**, and **NestJS**.

⭐ If this path helps you, consider starring the repo.

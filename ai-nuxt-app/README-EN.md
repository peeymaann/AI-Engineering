# AI Engineering

A learning and experimentation project for AI Engineering built with **Nuxt 4** and **Vue 3**.

This repository contains a streaming chat application that allows users to communicate with AI models. Currently, two providers are supported:

- **Ollama** (local execution)
- **Grok** (xAI models)

The user interface is fully designed in Persian with right-to-left (RTL) support.

---

## Features

- Streaming chat with responses displayed progressively
- Easy switching between Ollama and Grok through the user interface
- Modern UI built with Nuxt UI and Tailwind CSS
- Full support for Persian language and RTL layout
- Clean architecture with separated server-side APIs
- Uses the Vercel AI SDK for easy model integration

---

## Technologies Used

| Category | Technology |
|---|---|
| Framework | Nuxt 4 + Vue 3 |
| AI | Vercel AI SDK (`ai`, `@ai-sdk/vue`, `@ai-sdk/xai`) |
| Local Model | Ollama (`ollama-ai-provider-v2`) |
| UI | Nuxt UI 4 + Tailwind CSS 4 |
| State Management | Pinia |
| Language | TypeScript |
| Validation | Zod |
| Other | VueUse, Iconify (Lucide) |

---

## Prerequisites

- Node.js version 18 or higher
- pnpm (recommended), npm, yarn, or bun
- To use Ollama: Install and run [Ollama](https://ollama.com) locally
- To use Grok: An API key from [xAI](https://x.ai)

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/peeymaann/AI-Engineering.git
cd AI-Engineering
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```

### 3. Configure environment variables

If you want to use Grok, create a `.env` file in the project root:

```env
XAI_API_KEY=your_xai_api_key_here
```

### 4. Start the development server

```bash
pnpm dev -o
# or
npm run dev -o
```

The application will be available at:

```text
http://localhost:3000
```

---

## Usage

After starting the application:

1. Select your preferred provider at the top of the page:
   - **Ollama (Local)**
   - **Grok (xAI)**
2. Enter your message in the input box at the bottom and send it.
3. The response will be displayed as a stream.

---

## Project Structure

```text
AI-Engineering/
├── app/
│   ├── components/
│   │   └── AIChat.vue          # Main chat component
│   ├── pages/
│   │   └── index.vue           # Main page
│   ├── plugins/
│   └── assets/css/
├── server/
│   └── api/
│       ├── chat.post.ts        # Ollama API
│       └── chat-grok.post.ts   # Grok API
├── public/
├── nuxt.config.ts
├── package.json
└── README.md
```

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build the production version |
| `pnpm preview` | Preview the production build |
| `pnpm generate` | Generate a static site |

---

## License

This project is released under the [Apache License 2.0](LICENSE).

---

## Contributions and Feedback

This repository was created for weekly learning and experimentation in the field of AI.

If you have a suggestion or find a bug, feel free to open an Issue or submit a Pull Request.

---

Made with passion for learning AI Engineering.

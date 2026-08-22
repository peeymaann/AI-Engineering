# 🚀 مهندسی هوش مصنوعی (AI Engineering)

[English](./README.md) | [فارسی](./README.fa.md)

> مسیر عملی و هفتگی برای تبدیل‌شدن به **AI Engineer** با استک مدرن TypeScript.

پروژه‌های واقعی را مرحله‌به‌مرحله می‌سازید: چت استریم → RAG روی اسناد خودتان → بک‌اند NestJS.

---

## ✨ این مخزن چیست؟

این یک **مخزن تمرینی عملی** است، نه یک قالب خالی.

داخل آن می‌بینید:

- ✅ اپ چت Nuxt با Ollama و Grok
- ✅ پایپ‌لاین RAG با Supabase و Embedding
- ✅ آپلود متن و PDF
- ✅ APIهای NestJS برای جستجو، اسناد و چت RAG
- ✅ Git Tag برای هر مرحله مهم

---

## 🛠️ استک پروژه

| حوزه              | ابزارها                                  |
| ----------------- | ---------------------------------------- |
| 🖥️ فرانت‌اند      | Nuxt 4، Vue 3، TypeScript، Nuxt UI       |
| 🤖 AI SDK         | Vercel AI SDK (`ai`، `@ai-sdk/vue`)      |
| 🏠 مدل محلی       | Ollama (`gemma2:2b`، `nomic-embed-text`) |
| ☁️ مدل ابری       | xAI Grok                                 |
| 🗄️ دیتابیس برداری | Supabase (PostgreSQL + `pgvector`)       |
| 🧩 بک‌اند         | NestJS                                   |
| 📁 فایل‌ها        | Supabase Storage                         |

---

## 📂 ساختار مخزن

```text
AI-Engineering/
├── 📁 ai-nuxt-app/     # فرانت‌اند Nuxt + APIهای Nitro
├── 📁 rag-api/         # بک‌اند NestJS برای RAG
├── 📄 README.md        # نسخه انگلیسی
└── 📄 README.fa.md     # نسخه فارسی
```

---

## ▶️ نحوه اجرا

### 1️⃣ پروژه Nuxt

```bash
cd ai-nuxt-app
pnpm install
pnpm dev
```

🌐 آدرس برنامه: [http://localhost:3000](http://localhost:3000)

### 2️⃣ API مربوط به NestJS

```bash
cd rag-api
pnpm install
pnpm start:dev
```

🔌 آدرس API: [http://localhost:3002](http://localhost:3002)

### 3️⃣ Ollama

```bash
ollama list
```

مدل‌های لازم:

- `gemma2:2b`
- `nomic-embed-text`

---

## 🔐 متغیرهای محیطی

> ⚠️ فایل‌های واقعی `.env` را هرگز Commit نکنید.

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

---

## 🗺️ Roadmap هفتگی

### 📅 هفته ۱ — پایه‌های چت هوش مصنوعی

- راه‌اندازی پروژه Nuxt
- نصب و استفاده از Vercel AI SDK
- یادگیری `streamText` و استریم پاسخ
- ساخت رابط چت ساده
- اتصال به مدل محلی Ollama
- سوییچ اختیاری به مدل ابری (Grok)

🎯 **هدف:** درک کامل چت استریم‌شده از ابتدا تا انتها.

### 📅 هفته ۲ — تجربه کاربری بهتر + مدیریت state

- بهبود UI چت با Nuxt UI
- استفاده از `useChat`
- سوییچ بین مدل‌ها / APIها
- مدیریت state با Pinia
- ذخیره تاریخچه چت در `localStorage`
- پاک‌کردن چت و بازیابی بعد از رفرش

🎯 **هدف:** نزدیک‌شدن به تجربه چت واقعی و پایدار.

### 📅 هفته ۳–۴ — Prompting و نظم Backend

- System Prompt
- تمیزکاری APIها در Nitro
- مدیریت خطا و وضعیت loading
- نظم Git: Commit، Tag، توضیحات Release

🎯 **هدف:** تثبیت معماری چت قبل از ورود به RAG.

### 📅 هفته ۵–۶ — RAG (پاسخ‌گویی با بازیابی اطلاعات)

- آشنایی با Embedding و Vector Database
- راه‌اندازی Supabase + `pgvector`
- ساخت جدول `documents`
- تولید Embedding با `nomic-embed-text`
- پیاده‌سازی جستجوی شباهت (`match_documents`)
- اتصال context بازیابی‌شده به چت (`/api/chat-rag`)
- آپلود متن ساده
- آپلود PDF، استخراج متن، قطعه‌قطعه کردن و Embedding
- ذخیره فایل اصلی PDF در Supabase Storage

🎯 **هدف:** چت با اسناد و داده‌های خودتان.

### 📅 هفته ۷ — بک‌اند NestJS برای RAG

- ساخت پروژه NestJS (`rag-api`)
- اتصال NestJS به Supabase
- پیاده‌سازی:
  - `POST /rag/documents`
  - `POST /rag/search`
  - `POST /rag/chat`
- حفظ APIهای Nuxt در کنار NestJS
- امکان سوییچ Frontend بین Nuxt API و NestJS API
- بهبود کیفیت بازیابی با آستانه شباهت

🎯 **هدف:** جداسازی تمیز Frontend و Backend.

### 📅 هفته ۸ به بعد — مراحل بعدی (برنامه)

- یکسان‌سازی مسیر APIهای Nuxt و NestJS
- UI بهتر برای مدیریت اسناد
- احراز هویت و اسناد اختصاصی هر کاربر
- Agent / Tool Calling
- Multi-Agent ساده (Researcher + Writer + Reviewer)
- ابزار جستجوی وب با API مجاز (مثل Google Custom Search)
- مشاهده‌پذیری (مثلاً Langfuse)
- Deploy

---

## 🤖 آینده: Agentها + جستجوی وب

بعد از پایدار شدن RAG، مسیر ادامه پیدا می‌کند با:

1. **Tool Calling** — مدل در صورت نیاز ابزار صدا می‌زند
2. **Multi-Agent ساده** — Researcher، Writer، Reviewer
3. **API مجاز جستجوی وب** — ترکیب دانش داخلی Supabase با اطلاعات به‌روز اینترنت

---

## 📡 Endpointهای مهم

### Nuxt (`localhost:3000`)

| Method | Endpoint         | توضیح             |
| ------ | ---------------- | ----------------- |
| POST   | `/api/chat`      | چت محلی با Ollama |
| POST   | `/api/chat-grok` | چت ابری با Grok   |
| POST   | `/api/chat-rag`  | چت RAG (Nuxt)     |
| POST   | `/api/search`    | جستجوی شباهت      |
| POST   | `/api/documents` | آپلود متن         |
| POST   | `/api/pdf`       | آپلود PDF         |

### NestJS (`localhost:3002`)

| Method | Endpoint         | توضیح           |
| ------ | ---------------- | --------------- |
| POST   | `/rag/documents` | آپلود متن       |
| POST   | `/rag/search`    | جستجوی شباهت    |
| POST   | `/rag/chat`      | چت RAG (NestJS) |

---

## 🏷️ Git Tagها (نقاط عطف)

- `v0.1.0-week1`
- `v0.2.0-week2`
- `v0.5.0-rag`
- `v0.5.0-before-monorepo`
- `v0.6.0-monorepo`

دیدن یک مرحله مشخص:

```bash
git checkout v0.5.0-rag
```

بازگشت به آخرین نسخه:

```bash
git checkout main
```

---

## 🎯 هدف یادگیری

حرکت از مهارت Full Stack (Nuxt / TypeScript) به‌سمت AI Engineering با ساخت این قابلیت‌ها:

1. 💬 چت استریم با LLM
2. 🔄 سوییچ بین مدل‌ها
3. 📚 RAG روی اسناد خصوصی
4. 🔍 جستجوی برداری
5. 🧱 بک‌اند اختصاصی NestJS برای AI

---

## 📝 نکات

- این مخزن برای **یادگیری و نمایش پیشرفت** است
- مدل‌های محلی عمداً سبک انتخاب شده‌اند تا سریع‌تر اجرا شوند
- مدل‌های ابری (مثل Grok) برای مقایسه اختیاری هستند
- کلید `service_role` فقط باید روی سرور باشد

---

## 👤 درباره مخزن

مخزن تمرینی مسیر AI Engineering با **Nuxt**، **Vercel AI SDK**، **Supabase**، **Ollama** و **NestJS**.

⭐ اگر این مسیر برایتان مفید بود، ستاره دادن به مخزن کمک می‌کند دیده شود.

# 🚀 مهندسی هوش مصنوعی (AI Engineering)

[English](./README.md) | [فارسی](./README.fa.md)

> مسیر عملی و ۸ هفته‌ای برای تبدیل‌شدن به **AI Engineer** با استک مدرن TypeScript.

پروژه‌های واقعی را مرحله‌به‌مرحله می‌سازید: چت استریم → RAG → NestJS → Agent → داشبورد IoT → احراز هویت → Deploy.

---

## ✨ این مخزن چیست؟

این یک **مخزن تمرینی عملی** است، نه یک قالب خالی.

داخل آن می‌بینید:

- ✅ اپ چت Nuxt با Ollama و Grok
- ✅ پایپ‌لاین RAG با Supabase و Embedding
- ✅ آپلود متن و PDF
- ✅ APIهای NestJS برای جستجو، اسناد و چت RAG
- ✅ Git Tag برای هر مرحله مهم
- 🚧 Agent، داشبورد IoT، احراز هویت، مشاهده‌پذیری و Deploy (هفته‌های ۴ تا ۸)

---

## 🛠️ استک پروژه

| حوزه               | ابزارها                                           |
| ------------------ | ------------------------------------------------- |
| 🖥️ فرانت‌اند      | Nuxt 4، Vue 3، TypeScript، Nuxt UI، Pinia، VueUse |
| 🤖 AI SDK          | Vercel AI SDK (`ai`، `@ai-sdk/vue`)               |
| 🏠 مدل محلی        | Ollama (`gemma2:2b`، `nomic-embed-text`)          |
| ☁️ مدل ابری        | xAI Grok                                          |
| 🗄️ دیتابیس برداری | Supabase (PostgreSQL + `pgvector`)                |
| 🧩 بک‌اند          | NestJS                                            |
| 📁 فایل‌ها         | Supabase Storage                                  |

---

## 📂 ساختار مخزن

```text
AI-Engineering/
├── 📁 ai-nuxt-app/   # فرانت‌اند Nuxt + APIهای Nitro
├── 📁 rag-api/       # بک‌اند NestJS برای RAG
├── 📄 README.md      # نسخه انگلیسی
└── 📄 README.fa.md   # نسخه فارسی
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

در هفته‌های بعد ممکن است کلید Langfuse هم اضافه شود. آن را هم فقط در `.env` بگذارید.

---

## 🗺️ Roadmap هفتگی

| هفته | موضوع                                                    | عمق    | وضعیت     |
| ---- | -------------------------------------------------------- | ------ | --------- |
| ۱    | چت + Vercel AI SDK + Ollama / Grok                       | کامل   | ✅ انجام شده |
| ۲    | UI + Pinia + تاریخچه + Git                               | کامل   | ✅ انجام شده |
| ۳    | RAG + Embedding + PDF + Nest + سوییچ API                 | کامل   | ✅ انجام شده |
| ۴    | Tool Calling + یک Agent ساده                             | کامل   | 🔜 بعدی   |
| ۵    | Multi-Agent خیلی ساده (Researcher / Writer / Reviewer)   | سبک    | بعد       |
| ۶    | داشبورد کوچک IoT با هوش مصنوعی                           | متوسط  | بعد       |
| ۷    | Auth کوتاه + مشاهده‌پذیری مفهومی (Langfuse)              | آشنایی | بعد       |
| ۸    | Deploy + جمع‌بندی README                                 | کامل   | آخر       |

### 📅 هفته ۱ — چت + Vercel AI SDK + Ollama / Grok

- راه‌اندازی پروژه Nuxt
- نصب و استفاده از Vercel AI SDK
- یادگیری `streamText` و استریم پاسخ
- اتصال به مدل محلی Ollama (`gemma2:2b`)
- سوییچ اختیاری به مدل ابری Grok

🎯 **هدف:** درک چت استریم‌شده از رابط تا مدل و برگشت.

### 📅 هفته ۲ — UI + Pinia + تاریخچه + Git

- UI حرفه‌ای چت با Nuxt UI
- مدیریت state با Pinia و VueUse
- ذخیره تاریخچه چت در `localStorage`
- پاک‌کردن چت و بازیابی بعد از رفرش
- نظم Git: Commit، Tag، توضیحات Release

🎯 **هدف:** نزدیک شدن به تجربه چت واقعی و پایدار.

### 📅 هفته ۳ — RAG + Embedding + PDF + Nest + سوییچ API

- راه‌اندازی Supabase + `pgvector`
- تولید Embedding با `nomic-embed-text`
- جستجوی شباهت و `/api/chat-rag`
- آپلود متن و PDF، قطعه‌قطعه کردن، Embedding و ذخیره فایل
- بک‌اند NestJS (`rag-api`)
- مسیرها: `POST /documents`، `POST /search`، `POST /chat-rag`
- سوییچ Frontend بین APIی Nuxt و NestJS

🎯 **هدف:** چت با اسناد خودتان، با جداسازی تمیز Frontend و Backend.

### 📅 هفته ۴ — Tool Calling + Agent ساده

- یادگیری **Tool Calling**: مدل فقط متن نمی‌نویسد؛ می‌تواند ابزار بخواهد، نتیجه را بگیرد، بعد جواب بدهد
- ابزار `calculator` برای محاسبه
- ابزار `searchDocuments` برای RAG و اسناد خودتان
- ساخت یک Agent ساده که هر دو ابزار را انتخاب و استفاده کند
- API جدید: `POST /api/chat-agent`

🎯 **هدف:** فهم Tool Calling و قرار دادن آن داخل یک Agent ساده. مدل در صورت نیاز ابزار را صدا بزند، بعد پاسخ دهد.

### 📅 هفته ۵ — Multi-Agent ساده

- یادگیری **Multi-Agent**: به‌جای اینکه یک مدل همه کار را بکند، چند نقش کوچک پشت‌سرهم کار می‌کنند
- Researcher: از اسناد یا ابزارها واقعیت را پیدا می‌کند
- Writer: همان واقعیت را به پاسخ واضح تبدیل می‌کند
- Reviewer: پاسخ را بررسی و اشتباه را اصلاح می‌کند
- کوچک بماند: یک مثال آموزشی، نه سیستم تولیدی بزرگ

🎯 **هدف:** تقسیم کار بین نقش‌های ساده، نه ساخت سیستم بزرگ.

### 📅 هفته ۶ — داشبورد IoT با هوش مصنوعی

- نمایش داده سنسور روی داشبورد
- تحلیل هوشمند داده سنسور
- UI حرفه‌ای با Pinia / VueUse / Nuxt
- اتصال داشبورد به بک‌اند NestJS

🎯 **هدف:** داده را نشان دهید و بگذارید هوش مصنوعی آن را توضیح دهد.

### 📅 هفته ۷ — Auth کوتاه + مشاهده‌پذیری مفهومی

- احراز هویت کوتاه و امنیت پایه
- آشنایی با اسناد جدا برای هر کاربر
- آشنایی مفهومی با Langfuse و ثبت لاگ

🎯 **هدف:** فهم Auth و Trace؛ نه ساخت پلتفرم کامل تولیدی.

### 📅 هفته ۸ — Deploy + README نهایی

- بهینه‌سازی و تست نهایی
- Deploy روی Vercel
- README نهایی، Tagها، نکات رزومه و Portfolio

🎯 **هدف:** پروژه‌ای که بتوانید نشان دهید.

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

| Method | Endpoint     | توضیح           |
| ------ | ------------ | --------------- |
| POST   | `/documents` | آپلود متن       |
| POST   | `/search`    | جستجوی شباهت    |
| POST   | `/chat-rag`  | چت RAG (NestJS) |

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
6. 🛠️ Tool Calling و یک Agent ساده
7. 📡 داشبورد IoT با تحلیل هوشمند
8. 🔐 Auth کوتاه، مشاهده‌پذیری و Deploy

---

## 📝 نکات

- این مخزن برای **یادگیری و نمایش پیشرفت** است
- مدل‌های محلی عمداً سبک انتخاب شده‌اند تا سریع‌تر اجرا شوند
- مدل‌های ابری (مثل Grok) برای مقایسه اختیاری هستند
- کلید `service_role` فقط باید روی سرور باشد
- هفته ۷ آشنایی است، نه پشته کامل تولیدی Auth و Observability

---

## 👤 درباره مخزن

مخزن تمرینی مسیر AI Engineering با **Nuxt**، **Vercel AI SDK**، **Supabase**، **Ollama** و **NestJS**.

⭐ اگر این مسیر برایتان مفید بود، ستاره دادن به مخزن کمک می‌کند دیده شود.

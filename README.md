# 🧠 CodeVerix AI — AI-Powered Code Repair and Verification Platform

> **Identify programming errors, generate AI-explained fixes, and verify solutions in real time across 6 languages.**

CodeVerix AI is a full-stack AI-powered coding and assessment platform that helps developers and students analyze buggy code, understand root causes using **Google Gemini**, apply automated fixes in a **Monaco code editor**, and verify solutions against automated test cases inside a sandboxed multi-language execution engine.

---

## 🌐 Live Demo & Links

- **Frontend Application:** [codeverix-frontend.onrender.com](https://codeverix-frontend.onrender.com)
- **Backend API:** [codeverix-ai.onrender.com](https://codeverix-ai.onrender.com)
- **Backend Health Check:** [codeverix-ai.onrender.com/api/health](https://codeverix-ai.onrender.com/api/health)
- **GitHub Repository:** [github.com/priyadharsini43/CodeVerix-AI](https://github.com/priyadharsini43/CodeVerix-AI)

---

## 🚀 Key Features

- **AI-Powered Code Analysis & Repair:** Diagnoses syntax/logic bugs and generates corrected code with step-by-step explanations via Google Gemini (`@google/genai`).
- **VS Code-Style Editor:** Integrated **Monaco Editor** with syntax highlighting and multi-language support.
- **Multi-Language Execution Sandbox:** Compiles and executes **Java, Python, C, C++, JavaScript, and TypeScript** safely inside Docker.
- **Automated Test-Case Verification:** Validates user code and AI-repaired code against hidden and public test cases.
- **Placement Coding Practice & Assessments:** Structured coding challenges with automated scoring and result tracking.
- **Authentication & Persistence:** Secure JWT/Passport authentication with project, submission, and assessment storage in PostgreSQL via Prisma ORM.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, React, TypeScript, Monaco Editor, Tailwind CSS, Zustand, TanStack Query |
| **Backend** | NestJS, Fastify, TypeScript, Prisma ORM, JWT / Passport |
| **Database** | PostgreSQL (Neon / Render) |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Execution Engine** | Java (OpenJDK), Python 3, GCC / G++, Node.js |
| **Deployment** | Docker, Render |

---

## 🏗️ System Architecture

```text
User
  ↓
Next.js Frontend (Monaco Editor + TanStack Query)
  ↓
NestJS + Fastify Backend
  ├── Gemini AI (Bug Analysis & Code Repair)
  ├── PostgreSQL + Prisma (Users, Projects, Submissions)
  └── Multi-Language Execution Sandbox (Java, Python, C/C++, JS/TS)
          ↓
   Automated Test Verification
          ↓
       Results & Diagnostics
```

---

## 📁 Project Structure

```text
CodeVerix-AI/
├── backend/                # NestJS + Fastify API, Prisma schema, Gemini service & code runner
├── frontend/               # Next.js 14 App Router, Monaco Editor & Zustand state management
├── .env.example            # Environment variable template
├── .dockerignore           # Docker build exclusions
└── README.md               # Project documentation & deployment guide
```

---

## ⚡ Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/priyadharsini43/CodeVerix-AI.git](https://github.com/priyadharsini43/CodeVerix-AI.git)
cd CodeVerix-AI
```

### 2. Backend Setup
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run build
npm run start:dev
```
Backend runs on `http://localhost:3001`.

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## 🧪 Verification & Testing

Run backend unit and integration tests:
```bash
cd backend
npm test
```

---

## ☁️ Production Deployment on Render

### 1. PostgreSQL Database (Neon)
Create a free PostgreSQL database on [Neon](https://neon.tech) (`neondb` or `codeverix_db`) and copy the pooled connection string for `DATABASE_URL`.

### 2. Render Backend (Docker Web Service)
Because the execution sandbox requires native compilers (`gcc`, `g++`, `javac`, `python3`), deploy the backend as a **Docker Web Service**:
- **Environment:** Docker
- **Dockerfile Path:** `backend/Dockerfile`
- **Health Check Path:** `/api/health`

**Backend Environment Variables:**
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_long_production_jwt_secret_key_32chars
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_PRIMARY_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.5-flash-lite
FRONTEND_URL=[https://codeverix-frontend.onrender.com](https://codeverix-frontend.onrender.com)
```

*(Render automatically runs `npx prisma migrate deploy` and catalog auto-seeding on container startup.)*

### 3. Render Frontend (Node Web Service)
Deploy the Next.js frontend as a **Render Node Web Service**:
- **Environment:** Node
- **Build Command:** `cd frontend && npm install --legacy-peer-deps && npm run build`
- **Start Command:** `cd frontend && npm run start`

**Frontend Environment Variables:**
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=[https://codeverix-ai.onrender.com](https://codeverix-ai.onrender.com)
```

---

💡 *Built to streamline debugging, code verification, and technical interview preparation.*

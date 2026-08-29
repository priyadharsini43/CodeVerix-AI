# CodeVerix AI — AI-Powered Code Repair and Verification Platform

> **Tagline:** AI-Powered Code Repair and Verification Platform  
> **Overview:** Real working end-to-end platform featuring Monaco Editor, real-time Gemini AI structured diagnosis & fix generation, placement practice module with 60 problems, multi-language execution engine, and persisted PostgreSQL audit history.

---

## 🚀 Features

- **VS Code-Style Workspace:** Monaco Code Editor with side-by-side fix preview and diff comparison.
- **Placement Practice Module:** 60 placement-focused problems across Easy, Medium, and Hard difficulties with automated output verification.
- **6-Language Execution Engine:** Multi-language execution runners supporting **Java**, **Python**, **C**, **C++**, **JavaScript**, and **TypeScript**.
- **Gemini AI Integration:** Real-time bug analysis, line-level diagnosis, structured fix generation, and complexity estimation via `@google/genai`.
- **Authentication & Security:** JWT HTTP-only cookie-based authentication with `AuthGuard` route protection.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router, React 18, TypeScript)
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **Styling:** Tailwind CSS + shadcn/ui design language
- **State & Data:** Zustand + TanStack Query (`@tanstack/react-query`)

### Backend
- **Framework:** NestJS + Fastify (`@nestjs/platform-fastify`)
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Execution Runners:** GCC (`C`), G++ (`C++`), OpenJDK (`Java`), Python 3 (`Python`), Node.js (`JS`/`TS`)
- **AI Integration:** Official `@google/genai` SDK

---

## ☁️ Production Deployment on Render

### 1. Render PostgreSQL Database
Create a **Render PostgreSQL Database** (Database Name: `codeverix_db`).
Copy the Internal/External Connection String for `DATABASE_URL`.

### 2. Render Backend (Docker Web Service)
The backend requires native compilers (`gcc`, `g++`, `javac`, `python3`), so it MUST be deployed as a **Docker Web Service**.

- **Environment:** Docker
- **Dockerfile Path:** `backend/Dockerfile`
- **Health Check Path:** `/api/health`

**Environment Variables for Backend:**
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host/codeverix_db?sslmode=require
JWT_SECRET=your_long_production_jwt_secret_key_32chars
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_PRIMARY_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
FRONTEND_URL=https://your-frontend-service.onrender.com
```

**Production Database Migration:**
Run Prisma production migration during deployment:
```bash
npx prisma migrate deploy
```

---

### 3. Render Frontend (Node Web Service)
Deploy the Next.js frontend as a **Render Node Web Service**.

- **Environment:** Node
- **Build Command:** `cd frontend && npm install --legacy-peer-deps && npm run build`
- **Start Command:** `cd frontend && npm run start`

**Environment Variables for Frontend:**
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
```

---

## ⚡ Local Development Setup

### Backend Setup
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run build
npm run start:dev
```
Backend runs on `http://localhost:3001`.

### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## 🧪 Verification & Testing

Run backend tests:
```bash
cd backend
npm test
```

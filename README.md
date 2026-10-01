# CodeVerix AI — AI-Powered Code Repair and Verification Platform

CodeVerix AI is a full-stack AI-powered coding platform that helps developers identify programming errors, understand bugs, generate corrected code, and verify solutions through automated execution and testing.

## 🌐 Live Demo

**Frontend:**  
https://codeverix-frontend.onrender.com

**Backend API:**  
https://codeverix-ai.onrender.com

**Backend Health Check:**  
https://codeverix-ai.onrender.com/api/health

**GitHub:**  
https://github.com/priyadharsini43/CodeVerix-AI

## 🚀 Key Features

- AI-powered code analysis using Google Gemini
- AI-generated code fixes with explanations
- VS Code-style Monaco code editor
- Multi-language code execution
- Java, Python, C, C++, JavaScript and TypeScript support
- Automated test-case verification
- Placement coding practice
- JWT-based authentication
- Project and submission management
- Assessment and result tracking
- PostgreSQL database persistence

## 🛠️ Tech Stack

**Frontend**
- Next.js 14
- React
- TypeScript
- Monaco Editor
- Tailwind CSS
- Zustand
- TanStack Query

**Backend**
- NestJS
- Fastify
- TypeScript
- Prisma ORM
- JWT / Passport

**Database**
- PostgreSQL (Neon / Render)

**AI**
- Google Gemini API
- `@google/genai`

**Code Execution**
- Java / OpenJDK
- Python 3
- GCC / G++
- Node.js

**Deployment**
- Docker
- Render

## 🏗️ Architecture

```text
User
  ↓
Next.js Frontend
  ↓
NestJS Backend
  ├── Gemini AI
  ├── PostgreSQL + Prisma
  └── Code Execution
          ↓
   Test Verification
          ↓
       Results
```

---

## ☁️ Production Deployment on Render

### 1. Free PostgreSQL Database (Neon PostgreSQL)
Create a free PostgreSQL database on [Neon](https://neon.tech) (Database Name: `neondb` or `codeverix_db`).
Copy the pooled PostgreSQL Connection String for `DATABASE_URL`.

### 2. Render Backend (Docker Web Service)
The backend requires native compilers (`gcc`, `g++`, `javac`, `python3`), so it MUST be deployed as a **Docker Web Service**.

- **Environment:** Docker
- **Dockerfile Path:** `backend/Dockerfile`
- **Health Check Path:** `/api/health`

**Environment Variables for Backend:**
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_long_production_jwt_secret_key_32chars
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_PRIMARY_MODEL=gemini-3.6-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash
FRONTEND_URL=https://your-frontend-service.onrender.com
```

**Production Database Migration & Auto-Seeding:**
Render executes Prisma production migration and NestJS catalog auto-seeding automatically on container startup via `Dockerfile` / `npm run start:prod`:
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

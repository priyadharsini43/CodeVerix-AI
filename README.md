# CodeVerix AI — AI-Powered Code Repair and Verification Platform

> **Tagline:** AI-Powered Code Repair and Verification Platform  
> **Day 1 Goal:** Real working end-to-end platform for registering/logging in, creating projects, editing code in Monaco Editor, triggering real-time Gemini AI structured diagnosis & fix generation, and persisting records in PostgreSQL.

---

## 🚀 Overview

CodeVerix AI is a full-stack developer workspace designed for modern software debugging. The application features a VS Code-style Monaco Editor interface, real-time structured AI code diagnosis using the official `@google/genai` SDK, side-by-side fix preview with Monaco Diff comparison, and persisted PostgreSQL audit history.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router, React 18, TypeScript Strict Mode)
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **Styling:** Tailwind CSS + shadcn/ui design language
- **State Management:** Zustand + TanStack Query (`@tanstack/react-query`)
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide Icons (`lucide-react`)

### Backend
- **Framework:** NestJS + Fastify (`@nestjs/platform-fastify`)
- **Database & ORM:** PostgreSQL + Prisma ORM
- **AI Integration:** Official Google Gen AI SDK (`@google/genai` with `gemini-2.5-flash`)
- **Authentication:** JWT + Passport + Bcrypt with secure HTTP-only cookies (`access_token`)
- **Validation:** `class-validator`, `class-transformer`, Zod schema validation

---

## 🏛️ Modular Backend Architecture

```text
codeverix-ai/
├── backend/
│   ├── src/
│   │   ├── auth/         # Register, Login, Logout, JWT Strategy, HTTP-only Cookie auth
│   │   ├── users/        # User profile, /api/users/me
│   │   ├── projects/     # Project CRUD with strict user ownership guards
│   │   ├── submissions/  # Code submission & AI analysis trigger
│   │   ├── analyzer/     # Code analyzer orchestrator & size/language validation
│   │   ├── ai/           # AIProvider interface & GeminiProvider implementation (@google/genai)
│   │   ├── fixer/        # Fix formatting & diff metric calculation
│   │   ├── history/      # PostgreSQL query service for dashboard stats & submission logs
│   │   ├── common/       # Exception filters, interceptors, guards, decorators
│   │   ├── prisma/       # PrismaService wrapper
│   │   └── main.ts       # NestJS Fastify bootstrap with CORS & Cookie parser
│   └── prisma/
│       └── schema.prisma # User, Project, Submission, Analysis models
│
└── frontend/             # Next.js App Router application
    ├── app/              # Routes: /, /login, /register, /dashboard, /workspace/[projectId], /settings
    ├── components/       # Navbar, Monaco Editor, Diff View, Tab Panels
    ├── stores/           # Zustand Auth store
    ├── lib/              # API Client & utilities
    └── types/            # TypeScript interfaces
```

---

## 🛢️ Database Schema (Prisma)

- **`User`**: `id`, `name`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`
- **`Project`**: `id`, `userId` (FK User), `name`, `description`, `defaultLanguage`, `createdAt`, `updatedAt`
- **`Submission`**: `id`, `projectId` (FK Project), `language`, `sourceCode`, `createdAt`
- **`Analysis`**: `id`, `submissionId` (FK Submission, unique), `status` (`bug_found` | `no_bug_found` | `analysis_failed`), `bugs` (JSON array of `{ line, type, severity, message, explanation }`), `explanation`, `fixedCode` (nullable), `complexity` (nullable `{ time, space }`), `confidence`

---

## 🔑 Environment Variables Setup

Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/codeverix_db?schema=public"
JWT_SECRET="codeverix_super_secret_jwt_key_2026_dev_env"
PORT=3001
GEMINI_API_KEY="YOUR_REAL_GEMINI_API_KEY"
```

Create a `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## ⚡ Installation & Execution Guide

### Prerequisites
- Node.js `v20+` or `v24+`
- PostgreSQL 16/18 running locally on port 5432
- Database `codeverix_db` created in PostgreSQL

### 1. Backend Setup

```bash
cd backend
npm install --legacy-peer-deps

# Push Prisma schema to PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Build backend
npm run build

# Start dev server
npm run start:dev
```

The backend server will run on `http://localhost:3001`.

### 2. Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps

# Start Next.js development server
npm run dev
```

The frontend application will run on `http://localhost:3000`.

---

## 🧪 Testing

Run backend unit and integration tests:

```bash
cd backend
npm test
```

Tests cover:
1. User registration & email duplication rejection
2. Login credential verification & JWT generation
3. Protected route access guards
4. Project creation & strict user ownership isolation
5. Code submission validation (empty code, oversized payload, language checks)
6. Gemini AI provider structured response parsing & schema validation

---

## 📌 API Overview

- `POST /api/auth/register` — Register new user and set HTTP-only cookie
- `POST /api/auth/login` — Authenticate user and set HTTP-only cookie
- `POST /api/auth/logout` — Clear auth cookie
- `GET /api/users/me` — Retrieve current user profile
- `GET /api/projects` — List user's projects
- `POST /api/projects` — Create new project
- `GET /api/projects/:id` — Get project details & submissions
- `PATCH /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project
- `POST /api/submissions/analyze` — Run AI analysis on code, save submission & analysis to DB
- `GET /api/submissions` — Retrieve past code submissions
- `GET /api/history/dashboard` — Get dashboard statistics (Total Projects, Submissions, AI Fixes)
- `GET /api/health` — Service health check

---

## ⚠️ Current Limitations (Day 1 Scope)

- **Code Execution**: Day 1 scope provides AI-based code diagnosis, root cause explanation, and fix generation. Dynamic code execution in sandboxes is deferred to Day 2.
- **Verification Terminology**: The word "Verified" is strictly avoided in Day 1 because automated test execution and sandboxed execution will be integrated on Day 2.

---

## 🔮 Day 2 Planned Features

The following features will be added in Day 2:
- Sandboxed code execution engine (Judge0 integration)
- Background job processing (Redis + BullMQ)
- Automated unit test generation & execution
- Automated AI repair loop with empirical pass/fail verification

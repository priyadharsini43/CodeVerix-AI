# CodeVerix AI — AI-Powered Code Repair and Verification Platform

CodeVerix AI is a full-stack AI-powered coding platform that helps developers **identify programming errors, understand bugs, generate corrected code, and verify solutions through automated execution and testing**.

It combines AI-based code analysis, an online coding workspace, multi-language execution, placement practice, authentication, and persistent database storage into a single platform.

---

## 🌐 Live Demo

### Frontend

**https://codeverix-frontend.onrender.com**

### Backend API

**https://codeverix-ai.onrender.com**

### Backend Health Check

**https://codeverix-ai.onrender.com/api/health**

### GitHub Repository

**https://github.com/priyadharsini43/CodeVerix-AI**

---

## 🚀 Key Features

* **AI-Powered Code Analysis** – Detects bugs and explains programming errors using Google Gemini AI.
* **AI Code Fix Generation** – Generates corrected code with explanations.
* **VS Code-Style Workspace** – Monaco Editor with code editing and fix comparison.
* **Multi-Language Execution** – Supports Java, Python, C, C++, JavaScript, and TypeScript.
* **Placement Practice** – Programming problems with automated test-case verification.
* **Authentication** – JWT-based login and registration with HTTP-only cookies.
* **Project Management** – Create, view, update, and delete coding projects.
* **Submission History** – Stores previous coding submissions and AI analysis results.
* **Assessment Module** – Provides coding assessments with execution and result tracking.
* **PostgreSQL Persistence** – Stores users, projects, submissions, assessments, and history.

---

## 🛠️ Tech Stack

### Frontend

* Next.js 14
* React 18
* TypeScript
* Monaco Editor
* Tailwind CSS
* Zustand
* TanStack Query

### Backend

* NestJS
* Fastify
* TypeScript
* Prisma ORM
* JWT / Passport

### Database

* PostgreSQL

### AI

* Google Gemini API
* `@google/genai`

### Code Execution

* Java / OpenJDK
* Python 3
* GCC / G++
* Node.js

### Deployment

* Render
* Docker

---

## 🏗️ Architecture / Workflow

```text
                    User
                      │
                      ▼
             Next.js Frontend
          React + TypeScript
             Monaco Editor
                      │
                 HTTPS API
                      │
                      ▼
              NestJS Backend
             ┌────────┼────────┐
             │        │        │
             ▼        ▼        ▼
          Gemini   PostgreSQL  Code
            AI       + Prisma  Execution
             │
             ▼
       Bug Analysis
             │
             ▼
        Code Fix
             │
             ▼
       Test Verification
```

### Code Analysis Flow

```text
Source Code
    ↓
AI Analysis
    ↓
Bug Detection
    ↓
Error Explanation
    ↓
Corrected Code
    ↓
Code Execution
    ↓
Test Verification
```

---

## 📁 Project Structure

```text
CodeVerix-AI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── stores/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── submissions/
│   │   ├── assessments/
│   │   ├── history/
│   │   ├── ai/
│   │   └── common/
│   │
│   ├── prisma/
│   └── Dockerfile
│
├── README.md
└── .gitignore
```

---

## 💻 Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/priyadharsini43/CodeVerix-AI.git
cd CodeVerix-AI
```

### 2. Backend

```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run build
npm run start:dev
```

Backend runs on:

```text
http://localhost:3001
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, the frontend uses:

```env
NEXT_PUBLIC_API_URL=https://codeverix-ai.onrender.com
```

**Never commit actual API keys, database passwords, JWT secrets, or `.env` files to GitHub.**

---

## ☁️ Deployment

CodeVerix AI is deployed on **Render** using separate frontend and backend services.

### Frontend

```text
https://codeverix-frontend.onrender.com
```

* Framework: Next.js
* Runtime: Node.js
* Deployment: Render Web Service

### Backend

```text
https://codeverix-ai.onrender.com
```

* Framework: NestJS + Fastify
* Runtime: Docker
* Deployment: Render Web Service
* Database: PostgreSQL
* AI: Google Gemini API

The frontend communicates with the backend through the production API URL:

```text
Frontend
    ↓
https://codeverix-ai.onrender.com
    ↓
NestJS API
```

---

## 👩‍💻 Author

### Priyadharsini P

B.E. Computer and Communication Engineering

V.S.B. Engineering College, Karur

**GitHub:**
https://github.com/priyadharsini43

**Project Repository:**
https://github.com/priyadharsini43/CodeVerix-AI

**Live Application:**
https://codeverix-frontend.onrender.com

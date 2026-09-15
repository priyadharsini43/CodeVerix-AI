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
- PostgreSQL

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

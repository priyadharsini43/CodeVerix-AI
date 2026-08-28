# CodeVerix AI — AI-Powered Code Repair, Verification & Practice Platform

> AI-powered code analysis, automated repair, code execution, verification, and placement-oriented programming practice platform.

CodeVerix AI is a full-stack developer and placement-practice platform designed to help students and developers **write, analyze, repair, execute, and verify code** in a single workspace.

The platform combines a VS Code-style Monaco Editor, Gemini-powered code analysis, automated code repair, project management, programming practice, assessment evaluation, testcase execution, authentication, and persistent PostgreSQL storage.

---

## 🚀 Overview

CodeVerix AI provides two major development experiences:

### 1. AI Code Repair Workspace

Users can create projects, write source code using the Monaco Editor, submit code for AI analysis, identify programming issues, understand the root cause, and receive AI-generated corrected code with a side-by-side comparison.

### 2. Practice & Assessment Platform

Users can practice placement-oriented programming problems, select supported programming languages, execute their solutions against testcases, view compilation/runtime errors, check testcase results, and submit solutions for evaluation.

The platform maintains user-specific projects, submissions, assessment attempts, and progress using PostgreSQL and Prisma.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

- User registration
- User login
- User logout
- JWT-based authentication
- HTTP-only authentication cookies
- Password hashing with Bcrypt
- Duplicate email validation
- Invalid credential handling
- Protected backend APIs
- Protected frontend routes
- Automatic authentication state restoration
- Authenticated users redirected away from Login/Register
- Unauthenticated users redirected to Login
- User-specific project and submission access

---

## 🧠 AI-Powered Code Analysis

CodeVerix AI integrates Google's Gemini API for structured source-code analysis.

Features include:

- Source-code analysis
- Programming bug detection
- Line-level bug identification
- Bug type classification
- Bug severity classification
- Root-cause explanation
- Detailed issue explanation
- AI-generated corrected code
- Time complexity analysis
- Space complexity analysis
- Confidence score
- Structured AI response validation
- AI analysis persistence
- Analysis history

The backend uses the official Google Gen AI SDK.

---

## 🛠️ AI Code Repair Workspace

The workspace provides a developer-oriented coding environment built around Monaco Editor.

Features include:

- VS Code-style code editor
- Monaco Editor integration
- Project-based coding workspace
- Multiple programming languages
- Java
- Python
- C
- C++
- JavaScript
- TypeScript
- Code submission
- AI diagnosis
- AI-generated fix
- Monaco Diff Editor
- Original vs corrected code comparison
- Persistent project information
- Submission history
- Analysis results

---

# 🧪 Practice & Assessment System

CodeVerix AI includes a placement-oriented programming practice and assessment system.

## Practice Features

- 60+ curated programming problems
- Easy difficulty
- Medium difficulty
- Hard difficulty
- Topic-based organization
- Problem search
- Difficulty filtering
- Problem descriptions
- Constraints
- Sample input/output
- Multiple programming languages
- Monaco code editor
- Run functionality
- Submit functionality
- Testcase evaluation
- Compilation error detection
- Runtime error detection
- Wrong answer detection
- Accepted result detection
- Execution time reporting
- Testcase pass/fail results
- Score calculation
- Submission status
- Solved tracking
- Attempted tracking
- Not Started tracking

---

# 💻 Supported Programming Languages

The assessment execution engine currently supports:

| Language | Execution Support |
|----------|-------------------|
| Java | ✅ |
| Python | ✅ |
| C | ✅ |
| C++ | ✅ |
| JavaScript | ✅ |
| TypeScript | ✅ |

Each supported language has its own backend execution service.

---

# 📊 Assessment Evaluation

For submitted solutions, the backend evaluates the program against configured testcases.

The evaluation system can identify:

- Successful compilation
- Compilation errors
- Runtime errors
- Incorrect output
- Correct output
- Passed testcases
- Failed testcases
- Execution time
- Overall score
- Submission status

The frontend displays testcase-level evaluation results to the user.

---

# 📈 Dashboard & History

The platform maintains user-specific activity and performance information.

Dashboard/history functionality includes:

- Total projects
- Total submissions
- AI analysis history
- AI-generated fixes
- Practice progress
- Assessment attempts
- Assessment results
- Submission records
- User activity

---

# 🗄️ Database & Persistence

CodeVerix AI uses **PostgreSQL** as the primary database and **Prisma ORM** for database access.

The database manages application data including:

- Users
- Projects
- Code submissions
- AI analyses
- Assessments
- Assessment problems
- Testcases
- Assessment submissions
- Practice results

Database schema changes are maintained through Prisma migrations.

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Monaco Editor
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Lucide Icons

## Backend

- NestJS
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Passport
- Bcrypt
- Class Validator
- Class Transformer

## AI

- Google Gemini
- Official `@google/genai` SDK

## Code Editor

- Monaco Editor
- Monaco Diff Editor

## Code Execution

- Java execution service
- Python execution service
- C execution service
- C++ execution service
- JavaScript execution service
- TypeScript execution service

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         │     / Student        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Next.js Frontend   │
                         │                      │
                         │ Login / Register     │
                         │ Dashboard            │
                         │ Projects             │
                         │ Workspace            │
                         │ Practice             │
                         │ Assessments          │
                         │ History              │
                         └──────────┬───────────┘
                                    │
                              REST API + JWT
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    NestJS Backend    │
                         │                      │
                         │ Auth                 │
                         │ Users                │
                         │ Projects             │
                         │ Submissions          │
                         │ Analyzer             │
                         │ AI                   │
                         │ Fixer                │
                         │ History              │
                         │ Assessments          │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └──────────────┐
                    ▼                                   ▼
          ┌──────────────────┐                 ┌──────────────────┐
          │   PostgreSQL     │                 │    Gemini AI     │
          │                  │                 │                  │
          │ Users            │                 │ Code Analysis    │
          │ Projects         │                 │ Bug Detection    │
          │ Submissions      │                 │ Fix Generation   │
          │ Assessments      │                 │ Explanation      │
          │ Testcases        │                 └──────────────────┘
          └──────────────────┘

                         Assessment Requests
                                  │
                                  ▼
                  ┌────────────────────────────┐
                  │ Language Execution Services│
                  │                            │
                  │ Java                       │
                  │ Python                     │
                  │ C                          │
                  │ C++                        │
                  │ JavaScript                 │
                  │ TypeScript                 │
                  └──────────────┬─────────────┘
                                 │
                                 ▼
                       Testcase Evaluation
                                 │
                                 ▼
              ┌────────────────────────────────────┐
              │ Evaluation Result                  │
              │                                    │
              │ Accepted                           │
              │ Wrong Answer                       │
              │ Compilation Error                  │
              │ Runtime Error                       │
              └────────────────────────────────────┘

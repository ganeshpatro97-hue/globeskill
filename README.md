# 🌍 GlobeSkill — Technology & AI Education for Every Child

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

> **GlobeSkill** is an India-based NGO initiative dedicated to empowering children and youth from economically underserved communities with high-quality digital literacy, hands-on computer science, and AI-enabled career opportunities.

---

## 📑 Table of Contents
- [✨ Key Platform Features](#-key-platform-features)
- [🏗️ System Architecture](#️-system-architecture)
- [📂 Directory Hierarchy & Artifact Mapping](#-directory-hierarchy--artifact-mapping)
- [⚡ Quick Start & Local Setup](#-quick-start--local-setup)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🗄️ Database Setup (Supabase Cloud)](#️-database-setup-supabase-cloud)
- [🚀 Deployment Guide (Vercel)](#-deployment-guide-vercel)
- [🤖 AI Coding Mentor (Sparky)](#-ai-coding-mentor-sparky)
- [👥 Role-Based Portals](#-role-based-portals)

---

## ✨ Key Platform Features

- 🎓 **Student Learning Portal**: Interactive, gamified coding curriculum (Python, Scratch, Web Dev, AI Basics) with automated progress tracking and instant certificate issuance.
- 🧑‍🏫 **Trainer Workspace**: Live classroom management, attendance logging, assignment reviews, and student batch performance metrics.
- 📊 **NGO Executive Admin Dashboard**: Comprehensive data analytics, cohort enrollment reports, regional center oversight, and CSV/JSON reporting.
- 💖 **Transparent Donor System**: Real-time impact ledger, 80G tax receipt generation, track sponsorships, and automated financial milestone triggers.
- 🤖 **Sparky AI Learning Assistant**: Globally mounted kid-friendly coding mentor powered by Google Gemini 3.6 Flash.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   Learners & Donors    │
                                  │ (Mobile / Web Browser) │
                                  └───────────┬────────────┘
                                              │ HTTPS
                                              ▼
                        ┌───────────────────────────────────────────┐
                        │      GlobeSkill Next.js App Router        │
                        │           (Frontend & Edge API)           │
                        └─────┬───────────────────────────────┬─────┘
                              │                               │
             ┌────────────────┴───────────────┐               │
             │ REST / Supabase SDK            │               │ AI Prompts
             ▼                                ▼               ▼
┌─────────────────────────┐      ┌────────────────────────┐ ┌──────────────────┐
│  Supabase Cloud (Postgres)│    │ Payment Gateways       │ │ Google AI Studio │
│  - User Profiles & Roles │    │ - Stripe               │ │ - Gemini 3.6 Flash│
│  - Courses & Progress   │    │ - Razorpay             │ │ - Sparky Mentor    │
│  - Donations & 80G Logs │    │ - Resend (Tax Receipts)│ └──────────────────┘
└─────────────────────────┘      └────────────────────────┘
```

---

## 📂 Directory Hierarchy & Artifact Mapping

Our project follows the modern Next.js `src/` App Router structure:

```
globeskill/
├── .env.local.example          # Environment variable template
├── setup-workspace.sh          # One-click workspace scaffolding script
├── supabase-setup.sql          # Primary database migration & seed data
├── supabase-donations-setup.sql# Donor & financial ledger schema
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Global Root Layout (Auth + Sparky AI Mentor)
│   │   ├── page.tsx            # Main Landing & Impact Homepage
│   │   ├── login/              # Authentication login screen
│   │   ├── signup/             # Role-based onboarding registration
│   │   ├── student/            # Student Learning Portal & Course Player
│   │   ├── trainer/            # Trainer & Batch Management Dashboard
│   │   ├── admin/              # NGO Executive Analytics & Export Suite
│   │   ├── donor/              # Donor Impact & Transparency Hub
│   │   ├── donate/             # Secure Checkout & Tax Receipt Generator
│   │   └── api/
│   │       ├── health/         # System Health Check Endpoint
│   │       ├── auth/           # Login, Signup, Signout API Handlers
│   │       ├── ai/chat/        # Sparky AI Mentor Service (Gemini API)
│   │       ├── donations/      # Stripe Checkout & Webhook Handlers
│   │       └── admin/export/   # Platform Reporting & Data Export API
│   ├── components/
│   │   ├── AIChatbotUI.tsx     # Floating AI Assistant Component
│   │   ├── AiLearningAssistant.tsx # Sparky Interactive Chat Modal
│   │   ├── Navbar.tsx          # Responsive Global Navigation
│   │   ├── Footer.tsx          # Global NGO Footer & Legal Info
│   │   └── RoleGate.tsx        # Client-side Role-based Route Protection
│   ├── context/
│   │   └── AuthContext.tsx     # Supabase Auth Provider & Session State
│   ├── lib/
│   │   ├── supabase-client.ts  # Supabase Client Singleton & SSR Helpers
│   │   └── services/           # Decoupled Domain Business Logic Services
│   └── types/
│       └── database.ts         # TypeScript Contracts & Database Enums
```

---

## ⚡ Quick Start & Local Setup

### Option A: Automated Workspace Setup (Recommended)
Run the built-in setup script:
```bash
chmod +x setup-workspace.sh
./setup-workspace.sh
```

### Option B: Manual Setup
```bash
# 1. Clone the repository
git clone https://github.com/ganeshpatro97-hue/globeskill.git
cd globeskill

# 2. Install dependencies
npm install

# 3. Configure local environment
cp .env.local.example .env.local
# (Update .env.local with your Supabase and Gemini keys)

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in your root directory based on `.env.local.example`:

```env
# 1. Supabase Connection Settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-api-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 2. AI Learning Assistant Configuration
GEMINI_API_KEY=your-google-gemini-api-key

# 3. Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 4. Email & Tax Receipts
RESEND_API_KEY=re_...
NO_REPLY_EMAIL=noreply@globeskill.org

# 5. Local Server URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Database Setup (Supabase Cloud)

1. Create a new project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Run **`supabase-setup.sql`** to create:
   - User profiles with role-based access (`student`, `trainer`, `admin`, `donor`)
   - Automated profile synchronization trigger
   - Course catalog, lesson modules, progress tracking, and enrollments
   - Row Level Security (RLS) policies
4. Run **`supabase-donations-setup.sql`** to create:
   - Donor profiles and tax exemption (80G) tracking
   - Real-time impact ledger and campaign funding calculations
   - Automated payment webhook reconciliation

---

## 🚀 Deployment Guide (Vercel)

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, etc.).
4. Click **Deploy**.
5. Update your Supabase **Authentication > URL Configuration** with your live Vercel URL (e.g. `https://globeskill.vercel.app`).

---

## 🤖 AI Coding Mentor (Sparky)

GlobeSkill includes **Sparky**, an AI coding mentor designed specifically for young and first-time learners:
- 🎨 **Kid-Friendly Analogies**: Explains variables as *labelled toy boxes*, loops as *merry-go-rounds*, and functions as *magic recipe cards*.
- ⚡ **Real-Time Gemini 3.6 Flash**: Fast, safe, and engaging generative responses with code snippets and follow-up mini experiments.
- 🛡️ **Resilient Fallback Engine**: Local rule-based mentor engine ensures 100% uptime even if external APIs are unavailable.

---

## 👥 Role-Based Portals

| Role | Accessible Routes | Primary Capabilities |
| :--- | :--- | :--- |
| **Student** | `/student`, `/courses` | Enroll in courses, complete lessons, earn badges & certificates, chat with Sparky |
| **Trainer** | `/trainer` | Manage student batches, record attendance, review project submissions |
| **Admin** | `/admin` | Cohort management, regional center analytics, export platform data |
| **Donor** | `/donor`, `/donate` | Sponsor student seats, track fund allocation, download instant 80G tax receipts |

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

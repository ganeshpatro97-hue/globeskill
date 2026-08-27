# 🌍 GlobeSkill

> **Technology & AI Education for Every Child**  
> An India-based NGO initiative dedicated to helping children and learners from economically weaker families gain access to technical education, digital skills, AI education, and career opportunities.

---

## 📌 Phase 1 Goal
Build the smallest complete production-style application proving our full end-to-end development pipeline:
`Local Frontend & Backend` ➔ `Git Version Control` ➔ `GitHub Repository` ➔ `Live Public Deployment (Vercel)`.

---

## 🏗️ 3-Tier Layered Architecture

```
User / Mobile Browser
       │
       ▼
GlobeSkill Frontend (React / Next.js Client Component)
       │  [HTTP GET /api/health]
       ▼
Next.js API Controller (src/app/api/health/route.ts)
       │  [getPlatformStatus()]
       ▼
Business Logic Layer (src/lib/services/platform.service.ts)
       │
       ▼
JSON Response Payload
```

---

## 📁 Key Project Files & Folders

- **Frontend View**: [`src/app/page.tsx`](src/app/page.tsx) — Main landing page featuring responsive design, the interactive "Explore GlobeSkill" button, and live System Status query.
- **Backend API Route**: [`src/app/api/health/route.ts`](src/app/api/health/route.ts) — Server endpoint responding to `/api/health` with HTTP status handling.
- **Business Logic Layer**: [`src/lib/services/platform.service.ts`](src/lib/services/platform.service.ts) — Isolated business domain logic (`getPlatformStatus()`) ready for future Supabase & PostgreSQL integration.
- **TypeScript Data Contract**: [`src/types/platform.ts`](src/types/platform.ts) — Typed data structures ensuring reliability across backend and frontend layers.

---

## 🚀 Getting Started Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

4. **Verify the Health Endpoint**:
   Visit [http://localhost:3000/api/health](http://localhost:3000/api/health).

5. **Lint and Build for Production**:
   ```bash
   npm run lint
   npm run build
   ```


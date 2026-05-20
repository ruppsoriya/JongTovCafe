# Cafe Recommendation Website

This workspace contains a full-stack scaffold for a modern cafe recommendation website.

Structure:
- `backend/` — Express + SQLite (Sequelize) API (auth, cafes, reviews, recommendation util)
- `frontend/` — Next.js + Tailwind frontend (pages and components)

Quick start (requires Node.js):

Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Frontend

```bash
cd frontend
npm install
# optional: copy env and edit API URL if your backend runs elsewhere
# cp .env.local.example .env.local
npm run dev
```

API endpoints are under `/api/*` on the backend. The frontend expects the backend at `http://localhost:5000` by default (`NEXT_PUBLIC_API_URL`).

Next steps: implement more UI components, add Google Maps keys, improve recommendation algorithm, wire up auth on frontend.

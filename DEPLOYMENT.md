# Deployment guide

This repository contains a Node/Express backend (`backend`) and a Next.js frontend (`frontend`). The repo includes a `render.yaml` configured for the backend service.

Files added in this commit:
- `scripts/seed-remote.sh` — Bash script to seed a remote Postgres DB using `DATABASE_URL`.
- `scripts/seed-remote.ps1` — PowerShell equivalent.
- `scripts/deploy-backend.sh` — Helper to trigger a Render deploy via API (requires `RENDER_SERVICE_ID` and `RENDER_API_KEY`).

Quick overview — recommended flow

1. Create a Postgres database (Render managed DB or other provider). Copy the connection string (`DATABASE_URL`).
2. Create a Render Web Service for the backend (use `render.yaml` or point to `backend/Dockerfile`).
3. Add environment variables to the backend service on Render:
   - `DATABASE_URL` (postgres connection)
   - `JWT_SECRET` (generate a secure random string)
   - `GOOGLE_PLACES_API_KEY` (if required)
   - `DB_SSL` = `true` (if your DB requires SSL)
4. Deploy backend on Render.
5. Seed the database using one of the `scripts/` helpers (see below).
6. Deploy the frontend (Vercel recommended) and set `NEXT_PUBLIC_API_URL` to your backend URL.

Seeding the database

Option A — Run locally (recommended)

PowerShell:

```
.\scripts\seed-remote.ps1 -DatabaseUrl 'postgres://user:pass@host:port/dbname'
```

Bash:

```
DATABASE_URL='postgres://user:pass@host:port/dbname' ./scripts/seed-remote.sh
```

Option B — Run as a Render Job

- Render → New → Job → connect repo → Command: `npm run seed` → set environment variables (same as backend) → Create and Run.

Triggering a redeploy (optional)

You can either push new commits to GitHub (which will trigger Render) or use the provided `scripts/deploy-backend.sh` to request a deploy via the Render API. Example:

```
export RENDER_SERVICE_ID=svc-xxxxx
export RENDER_API_KEY=rz_...
./scripts/deploy-backend.sh
```

Frontend (Vercel)

- Import `ruppsoriya/JongTovCafe` into Vercel.
- Vercel will detect Next.js; use the default build settings.
- Set environment variable:
  - `NEXT_PUBLIC_API_URL` = `https://<your-backend-service>.onrender.com`

Local development

- Backend: `cd backend && npm ci && npm run dev` (ensure `DATABASE_URL` set for real DB or use sqlite local config)
- Frontend: `cd frontend && npm ci && npm run dev` (set `NEXT_PUBLIC_API_URL` if testing with remote backend)

If you want, paste your `DATABASE_URL` here and I will run the seed remotely for you.

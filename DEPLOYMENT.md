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

Option 2 — Replit (backend) + Vercel (frontend) + Supabase (free Postgres)
-------------------------------------------------------------------

This option keeps your current repo structure. Use Supabase free tier for the Postgres database, host the backend on Replit (free) and the frontend on Vercel (free).

1. Create a free Supabase project
  - Go to https://app.supabase.com and sign up.
  - Create a new project, choose a strong password and keep the database region close to you.
  - In the project dashboard → Settings → Database → Connection string, copy the `DATABASE_URL` (Postgres URL).

2. Deploy backend to Replit
  - Go to https://replit.com, sign in, click **Create** → **Import from GitHub** and paste `https://github.com/ruppsoriya/JongTovCafe`.
  - Replit will create a workspace. The repo contains a `.replit` file and `start-replit.sh` which will run the backend.
  - In Replit Settings → Secrets (Environment Variables), add:
    - `DATABASE_URL` = (the Supabase connection string)
    - `JWT_SECRET` = (generate a secret)
    - `GOOGLE_PLACES_API_KEY` = (if needed)
  - Click **Run**. Replit will execute `start-replit.sh`, install dependencies, and start `backend/server.js`.
  - Note the Replit web URL (e.g., `https://your-repl.username.repl.co`). Use this as the API base URL.

3. Deploy frontend to Vercel
  - Import the repo in Vercel (https://vercel.com/new) and pick `ruppsoriya/JongTovCafe`.
  - Set Environment Variable on Vercel:
    - `NEXT_PUBLIC_API_URL` = `https://<your-repl>.repl.co` (replace with your Replit URL)
  - Deploy — Vercel builds the Next.js app and serves it on a Vercel domain.

4. Seed the database
  - Locally (recommended):
    ```powershell
    $env:DATABASE_URL="postgres://user:pass@host:port/dbname"
    cd backend
    npm ci
    npm run seed
    ```
  - Or run the seed from within the Replit console (open Shell and run `npm run seed` in `/home/runner/<project>/backend`).

5. Verify
  - Visit the Replit backend URL `/api/...` endpoints to confirm they respond.
  - Visit the Vercel frontend URL and test flows.

Notes
 - Replit sleeps apps on free tier after inactivity; responses may be slower on first request.
 - Supabase free tier is suitable for development; upgrade when needed.


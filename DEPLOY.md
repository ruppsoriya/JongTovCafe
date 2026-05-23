# Deployment guide

This repository contains a Node/Express backend and a Next.js frontend. Recommended setup:

- Backend: Render (managed service) with a managed Postgres database
- Frontend: Vercel (Next.js first-class)

Quick steps

1. Push your repo to GitHub (branch `main`)

Backend (Render)

1. Create a new Web Service on Render and connect your GitHub repo.
2. Choose to deploy from the `backend` subfolder or use the provided `backend/Dockerfile`.
3. Add the following environment variables in the Render dashboard (use the values for your production DB and secrets):
   - `DATABASE_URL` — Postgres connection string (e.g. `postgres://user:pass@host:5432/db`)
   - `JWT_SECRET` — a strong secret
   - `GOOGLE_PLACES_API_KEY` — (optional)
   - `DB_SSL` — set to `true` if using SSL for Postgres
4. (Optional) Add a Managed Postgres database in Render and copy the `DATABASE_URL` into the service env.
5. Deploy the service. To seed the DB, run `npm run seed` in the deployed instance (Render web UI -> Shell).

Frontend (Vercel)

1. Sign into Vercel and import your GitHub repo.
2. Set the root directory to the `frontend` folder when configuring the project.
3. Add an environment variable:
   - `NEXT_PUBLIC_API_URL` — the public URL of your backend service (e.g. `https://cafe-recs-backend.onrender.com`)
4. Deploy — Vercel will build and host the Next.js app.

Notes & production considerations

- Database: migrate from SQLite to Postgres (this repo already supports `DATABASE_URL` via `backend/models/index.js`).
- Secrets: never commit real secrets; use provider secret managers.
- OneDrive: avoid storing build artifacts on OneDrive; it may interfere with Next.js `.next` files.
- SSL: If using managed Postgres, set `DB_SSL=true` in env to enable SSL options.

If you want, I can create the Render service and Vercel project or prepare a `render.yaml` to import. Tell me which provider account you want to use and I will proceed.

CI / automatic deploys

To automate deploys on push to `main`, add the following GitHub secrets to your repository (Settings → Secrets → Actions):

- `RENDER_API_KEY` — Render API key with deploy permissions
- `RENDER_SERVICE_ID` — the Render service id for the backend
- `VERCEL_TOKEN` — Vercel personal token
- `VERCEL_ORG_ID` — Vercel organization id
- `VERCEL_PROJECT_ID` — Vercel project id for the frontend

I added two example GitHub Actions workflows in `.github/workflows/`:

- `deploy-backend.yml` — triggers a Render deploy via the Render API when `main` is pushed
- `deploy-frontend.yml` — calls the Vercel GitHub Action to deploy the `frontend` folder

After you add the secrets, every push to `main` will automatically deploy backend and frontend.

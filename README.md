# Book Store

React shop + FastAPI API + Neon Postgres. Live on **two Vercel projects** (both free).

## Live setup

### 1. API project (new)

1. Vercel → **Add New Project** → same GitHub repo `Book-store`
2. **Root Directory:** `fastapi-server` (Edit, then select that folder)
3. Environment variables:
   - `DATABASE_URL` — Neon URL only, no `psql`
   - `SKIP_DB_CREATE` = `1`
   - `ADMIN_EMAIL` = `admin@gmail.com`
   - `ADMIN_PASSWORD` = your password
   - `JWT_SECRET` = your secret
   - `FRONTEND_ORIGIN` = `https://book-store-eight-gray.vercel.app`
4. Deploy. Copy the URL, example: `https://book-store-xxxxx.vercel.app`
5. Open `/all-books` on that URL. JSON books list should appear.

### 2. Website project (existing `book-store`)

1. Settings → Environment Variables
2. `VITE_API_URL` = the API URL from step 1 (**no trailing slash**)
3. **Redeploy** the website (Vite bakes this in at build time)

Shop and reviews will load from that API.

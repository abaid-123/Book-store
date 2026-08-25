# Book Store

Online bookstore with a React shop and FastAPI admin API. Live host: **Vercel** (one URL). Database: **Neon**.

## Go live

1. Push this repo to GitHub.
2. Vercel project settings:
   - **Root Directory:** empty (repository root)
   - Environment variables:
     - `DATABASE_URL` — Neon URL
     - `SKIP_DB_CREATE` = `1`
     - `ADMIN_EMAIL` = `admin@gmail.com`
     - `ADMIN_PASSWORD` = your password
     - `JWT_SECRET` = a long random string
     - `FRONTEND_ORIGIN` = `*`
3. Redeploy. Site: `https://your-app.vercel.app` — API: `https://your-app.vercel.app/api/all-books`

## Local

```bash
cd fastapi-server
python main.py

cd mern-client
npm run dev
```

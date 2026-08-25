# Book Store

Online bookstore: browse and search books, save favorites, leave reviews, and manage inventory from an admin dashboard.

- **Frontend:** React (Vite) in `mern-client`
- **Backend:** FastAPI in `fastapi-server`
- **Database:** PostgreSQL

## Run locally

**API** (http://127.0.0.1:5000)

```bash
cd fastapi-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python main.py
```

**Website** (http://localhost:5173)

```bash
cd mern-client
npm install
copy .env.example .env
npm run dev
```

Admin login: `admin@gmail.com` / password from `.env` (`ADMIN_PASSWORD`, default `admin1`).

## Go live (Render)

1. Push this repo to GitHub.
2. Open [Render Blueprint](https://dashboard.render.com/blueprints) and connect `Book-store`.
3. After deploy, copy the **bookstore-web** URL — that is the live site.
4. In **bookstore-api** Environment, set `FRONTEND_ORIGIN` to that website URL.
5. Sign in with the generated `ADMIN_PASSWORD` (Render dashboard → Environment).

If Render’s free database is not available, create a free Postgres database on [Neon](https://neon.tech), then paste its connection string into `DATABASE_URL` on the API service.

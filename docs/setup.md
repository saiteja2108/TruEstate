# Setup & Run (Windows CMD)

1) Clone repository

```cmd
git clone <your-repo-url>
cd truestate
```

2) Install dependencies (root uses workspaces but you can install per package):

```cmd
cd backend
npm install
cd ..\frontend
npm install
```

3) Start backend (CMD):

```cmd
cd backend
npm run dev
```

If you have a large CSV (example: 1,000,000 rows) place it at `backend/data/sales.csv` and create the SQLite DB before starting the server:

```cmd
cd backend\scripts
node import_csv_to_sqlite.js ..\data\sales.csv ..\data\sales.db
```

After the import completes, start the backend as above and the server will use the created `sales.db` for queries.

4) Start frontend (CMD):

```cmd
cd frontend
npm run dev
```

Frontend expects backend at `http://localhost:4000` by default. To change, set `VITE_API_URL` in `.env` at the `frontend` root.

Deployment
- To deploy frontend to Netlify: connect the repository and set build command `npm --prefix frontend run build` and publish directory `frontend/dist`.

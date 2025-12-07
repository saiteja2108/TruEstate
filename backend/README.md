# TruEstate Backend

This is the backend for the TruEstate Retail Sales Management System.

Features:
- Loads `data/sales.csv` into memory on startup
- Exposes `GET /api/sales` with search, filters, sorting, and pagination


Quick start:

1. Install dependencies:

```cmd
cd backend
npm install
```

2. Start dev server (development mode):

```cmd
cd backend
npm run dev
```

3. API:

`GET http://localhost:4000/api/sales` supports query params:
- `q` (search by customer name or phone)
- `region`, `gender`, `category`, `paymentMethod`
- `ageMin`, `ageMax`
- `tags` (comma-separated tags)
- `startDate`, `endDate` (ISO yyyy-mm-dd)
- `sort` (date_desc, date_asc, quantity_desc, quantity_asc, name_asc, name_desc)
- `page`, `perPage`

Company links

- Website: https://www.truestate.in/
- LinkedIn: https://www.linkedin.com/company/truestateindia/

Importing a large CSV (1,000,000 rows)

1. Place your CSV at `backend/data/sales.csv` (the repository includes a small sample).
2. Run the importer in CMD (this creates `backend/data/sales.db`):

```cmd
cd backend\scripts
node import_csv_to_sqlite.js ..\data\sales.csv ..\data\sales.db
```

3. Once the DB is created the backend will start normally with `npm run dev`.

Notes:
- The importer uses `better-sqlite3` and creates indexes for good query performance.
- For very large CSVs the import may take time; monitor the output for progress messages.

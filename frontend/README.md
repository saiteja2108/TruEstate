REMINDER: Use CMD on Windows to run these commands (not PowerShell)

Development (CMD):

cd frontend
npm install
npm run dev

Build:

cd frontend
npm run build

Environment:
Create a `.env` file at the frontend root with `VITE_API_URL=http://localhost:4000` if your backend runs elsewhere.

Company links:
- Website: https://www.truestate.in/
- LinkedIn: https://www.linkedin.com/company/truestateindia/
# TruEstate Frontend

This is the frontend for the TruEstate Retail Sales Management System (Vite + React + Tailwind + Framer Motion).

Quick start (Windows CMD):

1. Install dependencies:

```cmd
cd frontend
npm install
```

2. Start development server:

```cmd
cd frontend
npm run dev
```

3. Build for production:

```cmd
cd frontend
npm run build
```

The app expects the backend API at `http://localhost:4000/api/sales` by default.

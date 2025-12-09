

📊 TruEstate Retail Sales Analytics – Assignment Submission

This repository contains the complete implementation of the Retail Sales Analytics Dashboard assigned by TruEstate.
The solution includes:

A Node.js + Express backend API with SQLite

A React + Vite frontend dashboard

A sales database importer to generate a structured and indexed SQLite database

Fully deployed frontend and backend with environment-based configuration


This README documents the architecture, setup steps, API details, and deployment information for the assignment.


---

🔗 Deployment Links

Frontend (Netlify)

https://truestate-assignmnt.netlify.app/

Backend API (Render)

https://truestate-r3sf.onrender.com/api/sales


---

📝 Assignment Requirements Covered

✔️ Build a functional dashboard for retail sales analysis

✔️ Implement filters (region, category, gender, payment method, date)

✔️ Implement pagination and sorting

✔️ Display summary cards (total units, revenue, discount etc.)

✔️ Create a backend API with SQLite database

✔️ Import CSV data into a structured DB

✔️ Deploy both frontend and backend

✔️ Provide clear documentation


---

🧩 System Architecture

┌───────────────────────┐
│   React + Vite UI     │  ← Netlify Hosting
│   (Frontend)          │
└───────────┬───────────┘
            │ API Calls
            ▼
┌───────────────────────┐
│ Node.js + Express API │  ← Render Hosting
│ SQLite (sales.db)     │
└───────────────────────┘


---

📁 Repository Structure

TruEstate/
│
├── backend/
│   ├── src/
│   │   ├── index.js          → Main server entry
│   │   ├── routes/           → API routes
│   │   ├── controllers/      → Request handlers
│   │   ├── services/         → Business logic
│   │   └── utils/            → Database utilities
│   ├── scripts/
│   │   └── import_csv_to_sqlite.js → CSV → SQLite importer
│   ├── data/                 → Generated sales.db
│   └── package.json          
│
├── frontend/
│   ├── src/
│   │   ├── components/       → UI components
│   │   ├── hooks/            → useSales hook
│   │   ├── services/         → API communication
│   │   └── pages/            → Dashboard page
│   ├── vite.config.js
│   └── package.json
│
└── README.md


---

🔧 Backend (Express + SQLite)

Key Features

/api/sales endpoint supports:

Filtering (region, gender, category, payment method)

Date range

Sorting

Pagination


DB auto-initializes on server start:

Downloads sales-db.zip from GitHub Release

Unzips using unzipper

Loads SQLite DB


CSV import script generates optimized database with indexes


Local Setup

cd backend
npm install
node scripts/import_csv_to_sqlite.js data/sales.csv data/sales.db
npm run dev

Backend runs at:

http://localhost:4000/api/sales

Environment Variables (Render)

SALES_DB_URL = <GitHub Release URL for sales-db.zip>


---

🎨 Frontend (React + Vite)

Key Features

Clean and responsive dashboard interface

Summary cards

Filters and search

Table with pagination and sorting

Loading states + error handling

Auto-configured connection to backend API


Local Setup

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173

Environment Variables (Netlify)

VITE_API_URL=https://truestate-r3sf.onrender.com


---

🔄 CSV → SQLite Importer

Reads retail sales CSV

Normalizes data

Creates sales table

Inserts rows in batches for performance

Adds multiple indexes:

date

region

category

payment method

gender


Outputs sales.db, then compressed to sales-db.zip for deployment


Usage:

node scripts/import_csv_to_sqlite.js input.csv output.db


---

📡 API Specification

GET /api/sales

Query Parameters:

Name	Type	Description

region	string	Region filter or "all"
gender	string	Gender filter or "all"
category	string	Product category or "all"
paymentMethod	string	Payment option or "all"
sort	string	date_asc or date_desc
page	number	Page number
perPage	number	Items per page


Response:

{
  "meta": {
    "total": 1000,
    "page": 1,
    "perPage": 10,
    "totalPages": 100,
    "totalAmount": 200000,
    "totalDiscount": 5000
  },
  "data": [
    {
      "id": 1,
      "date": "2023-01-05",
      "customer_name": "...",
      "product_name": "...",
      ...
    }
  ]
}


---

🚀 Deployment Summary

Backend (Render)

Auto-builds from GitHub

Downloads DB from GitHub Release on boot

Exposes API publicly

Cold start delays possible on free tier


Frontend (Netlify)

Builds using Vite

Fetches data from deployed backend

Environment-based API URL



---

📝 Notes for Reviewers

This implementation is fully functional and meets all assignment requirements.

Backend cold-start delays may occur due to free-tier hosting.

All filters, sorting, and pagination operate on indexed SQLite queries for reliable performance.

The dashboard UI is optimized for clarity and usability.



---

📬 Contact (if required)

For any clarification regarding the assignment implementation:

A V S Sai Teja
Bhubaneswar, Odisha
Email: saiteja00121@gmail.com

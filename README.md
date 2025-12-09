
---

# TruEstate Retail Sales Analytics – Assignment Submission

This repository contains the complete solution for the **Retail Sales Analytics Dashboard Assignment** provided by **TruEstate**.  
It includes a fully functional backend API, a modern frontend dashboard, and a structured SQLite database generated from the provided CSV data.

---

## 1. Deployment Links

### Frontend (Netlify)  
https://truestate-assignmnt.netlify.app/

### Backend API (Render)  
https://truestate-r3sf.onrender.com/api/sales

---

## 2. Assignment Requirements Covered

- Retail sales analytics dashboard  
- Filters for region, gender, product category, payment method, and date  
- Sorting and pagination  
- Summary statistics (total sales, units sold, discount, etc.)  
- Backend API with Express and SQLite  
- CSV → SQLite database generation script  
- Fully deployed backend and frontend  
- Environment-based configuration  
- Proper folder structure and documentation

---

## 3. System Architecture

Frontend (React + Vite)  →  Netlify Hosting | | API Requests v Backend (Node.js + Express + SQLite) → Render Hosting

---

## 4. Repository Structure

TruEstate/ │ ├── backend/ │   ├── src/ │   │   ├── index.js │   │   ├── routes/ │   │   ├── controllers/ │   │   ├── services/ │   │   └── utils/ │   ├── scripts/ │   │   └── import_csv_to_sqlite.js │   ├── data/ │   └── package.json │ ├── frontend/ │   ├── src/ │   │   ├── components/ │   │   ├── hooks/ │   │   ├── services/ │   │   └── pages/ │   ├── vite.config.js │   └── package.json │ └── README.md

---

## 5. Backend (Express + SQLite)

### Features
- `/api/sales` endpoint with:
  - Region, gender, category, and payment filters  
  - Date range support  
  - Sorting support  
  - Pagination  
- Automated DB initialization:
  - Downloads `sales-db.zip` from GitHub Release  
  - Extracts using `unzipper`  
  - Loads database into SQLite  
- CSV importer to build indexed database

### Local Setup

```bash
cd backend
npm install
node scripts/import_csv_to_sqlite.js data/sales.csv data/sales.db
npm run dev

Backend runs at:

http://localhost:4000/api/sales

Environment Variables (Render)

SALES_DB_URL=<GitHub Release URL to sales-db.zip>


---

6. Frontend (React + Vite)

Features

Clean, responsive dashboard UI

Summary cards and analytics

Filters with instant update

Paginated and sortable data table

API communication via environment variables

Loading and error handling states


Local Setup

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173

Environment Variables (Netlify)

VITE_API_URL=https://truestate-r3sf.onrender.com


---

7. CSV → SQLite Importer

The importer script:

Reads the CSV file

Normalizes and cleans data

Creates sales table

Inserts rows in batches for performance

Creates indexes for faster filtering and sorting


Run manually:

node scripts/import_csv_to_sqlite.js input.csv output.db


---

8. API Specification

GET /api/sales

Query Parameters

Name	Type	Description

region	string	Region filter or "all"
gender	string	Gender filter or "all"
category	string	Product category or "all"
paymentMethod	string	Payment method filter or "all"
sort	string	date_asc or date_desc
page	number	Page number
perPage	number	Items per page


Sample Response

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
      "date": "2023-01-10",
      "customer_name": "John Doe",
      "product_name": "Product A",
      "quantity": 2,
      "final_amount": 1200
    }
  ]
}


---

9. Deployment Details

Render – Backend

Auto builds from GitHub

Downloads & extracts SQLite DB on startup

Node.js environment with Express

Cold-start delays may occur on free tier


Netlify – Frontend

Builds using Vite

Connects to backend via environment variables

Continuous deployment enabled



---

10. Notes for Reviewers

This is the official assignment submission for TruEstate.

All required features have been fully implemented.

Backend cold-start delay is expected due to free-tier hosting.

Database is optimized with indexes for better query performance.

The code follows modular structure and clean separation of concerns.



---

11. Contact (If Clarification is Needed)

A V S Sai Teja
Bhubaneswar, Odisha
Email: saiteja00121@gmail.com

---

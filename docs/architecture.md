# Architecture — TruEstate Retail Sales Management System

This document explains the high-level architecture of the assignment.

Overview
- Backend: Node.js + Express. Loads the CSV dataset into memory at startup and exposes a single endpoint `GET /api/sales`.
- Frontend: React (Vite) + TailwindCSS + Framer Motion. A single-page app that keeps search/filter/sort/pagination state in the URL.

Directory Structure
- `backend/`
  - `src/controllers/` — Express controllers
  - `src/services/` — Business logic composition
  - `src/utils/` — CSV loader, filters, sorting, pagination utilities
  - `data/sales.csv` — CSV dataset (sample included). The loader normalizes fields listed in the assignment.

- `frontend/`
  - `src/components/` — UI building blocks (SearchBar, FilterPanel, TransactionTable, SortDropdown, Pagination)
  - `src/pages/` — `Home` page binds behavior
  - `src/hooks/` — data hooks such as `useSales`
  - `src/services/` — API client wrapper
  - `src/utils/` — URL state helpers for query string sync

Key Design Decisions
- Single API endpoint: keeps client simple and server responsible for filtering, sorting and pagination. The server returns `meta` and `data` so the client renders efficiently.
- CSV loader: sync parsing and light normalization for predictable data shape. For large datasets this would switch to streaming or a proper DB.
- URL-driven UI state: all filters, search, sort and page are stored in query params so shares/bookmarks are stable.
- UI theme — "Dynamic Data Zones": soft gradients and animated zones using Framer Motion to match the cinematic motion requirement.

Extensibility
- Swap CSV for a DB by replacing `csvLoader.getData()` with a persistence layer; the service layer will remain the same.
- Add authentication and role-based filtering in controllers.

Company links (reference):
- Website: https://www.truestate.in/
- LinkedIn: https://www.linkedin.com/company/truestateindia/

import React, { useMemo, useState, useEffect } from 'react'
import ZoneLayout from '../components/ZoneLayout'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import TransactionTable from '../components/TransactionTable'
import SortDropdown from '../components/SortDropdown'
import Pagination from '../components/Pagination'
import useSales from '../hooks/useSales'
import { parseQuery, setQuery } from '../utils/urlState'

export default function Home() {
  const qParams = parseQuery()
  const initial = {
    q: qParams.q || '',
    region: qParams.region || 'all',
    gender: qParams.gender || 'all',
    ageMin: qParams.ageMin || '',
    ageMax: qParams.ageMax || '',
    category: qParams.category || 'all',
    tags: qParams.tags || '',
    paymentMethod: qParams.paymentMethod || 'all',
    startDate: qParams.startDate || '',
    endDate: qParams.endDate || '',
    sort: qParams.sort || 'date_desc',
    page: Number(qParams.page || 1),
    perPage: Number(qParams.perPage || 10)
  }

  const [state, setState] = useState(initial)

  useEffect(() => setQuery(state), [state])

  const params = useMemo(() => ({
    q: state.q,
    region: state.region,
    gender: state.gender,
    ageMin: state.ageMin,
    ageMax: state.ageMax,
    category: state.category,
    tags: state.tags,
    paymentMethod: state.paymentMethod,
    startDate: state.startDate,
    endDate: state.endDate,
    sort: state.sort,
    page: state.page,
    perPage: state.perPage
  }), [state])
  const [force, setForce] = useState(0)
  const paramsWithForce = useMemo(() => ({ ...params, __force: force }), [params, force])

  const { data, meta, loading, error } = useSales(paramsWithForce)

  function setPartial(p) { setState(s => ({ ...s, ...p })) }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="https://media.licdn.com/dms/image/v2/D560BAQFbsMtdFR6kyg/company-logo_200_200/company-logo_200_200/0/1710768543634/truestateindia_logo?e=1766620800&v=beta&t=QLYHIugWYu6I1EYROFy3CqkU59SHkCdiTuKQ4XAGo-U" alt="TruEstate logo" className="h-10 w-auto bg-white rounded" />
            <div>
              <div className="text-lg font-semibold text-white">Sales Management System</div>
            </div>
          </div>
          <SearchBar value={state.q} onChange={q => setPartial({ q, page: 1 })} />
        </div>

        {/* Filters Inline */}
        <ZoneLayout>
          <FilterPanel value={state} onChange={(v) => setState(s => ({ ...s, ...v, page: 1 }))} />
        </ZoneLayout>

        {/* Stats Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4">
            <ZoneLayout className="p-4 text-center">
              <div className="text-slate-400 text-sm">Total units sold</div>
              <div className="text-2xl font-bold text-white mt-1">{meta.total || 0}</div>
            </ZoneLayout>
            <ZoneLayout className="p-4 text-center">
              <div className="text-slate-400 text-sm">Total Amount</div>
              <div className="text-2xl font-bold text-white mt-1">₹{(meta.totalAmount || 0).toLocaleString()}</div>
            </ZoneLayout>
            <ZoneLayout className="p-4 text-center">
              <div className="text-slate-400 text-sm">Total Discount</div>
              <div className="text-2xl font-bold text-white mt-1">₹{(meta.totalDiscount || 0).toLocaleString()}</div>
            </ZoneLayout>
          </div>
        )}

        {/* Sort + Results Info */}
        <div className="flex items-center justify-between">
          <div>
            <SortDropdown value={state.sort} onChange={(sort) => setPartial({ sort, page: 1 })} />
          </div>
          <div className="text-slate-300 text-sm">Showing {data.length} of {meta.total || 0}</div>
        </div>

        {/* Table */}
        <ZoneLayout>
          {loading ? (
            <div className="p-6 text-center text-slate-300">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-400 space-y-3">
              <div className="font-medium">Error loading data: {error.message}</div>
              <div className="text-sm text-slate-300">Common causes:</div>
              <ul className="text-xs text-slate-400 list-disc list-inside">
                <li>Backend is not running on <code>http://localhost:4000</code></li>
                <li>Database file `backend/data/sales.db` is missing (run importer)</li>
              </ul>
              <div className="text-left text-xs bg-slate-800 p-2 rounded">
                <div className="font-medium">Quick fix (CMD)</div>
                <pre className="text-xs text-slate-300">
cd backend
npm install
cd scripts
node import_csv_to_sqlite.js ..\data\sales.csv ..\data\sales.db
cd ..
npm run dev
                </pre>
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setForce(f => f + 1)} className="px-3 py-1 rounded bg-indigo-600 text-white">Retry</button>
                <a href="/api/sales" target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-slate-700 text-slate-200">Open API</a>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="p-6 text-center text-slate-300">No results found for current filters.</div>
          ) : (
            <TransactionTable data={data} />
          )}
        </ZoneLayout>

        {/* Pagination */}
        <div className="flex justify-end">
          <Pagination meta={meta} onChange={(p) => setPartial({ page: p })} />
        </div>
      </div>
    </div>
  )
}

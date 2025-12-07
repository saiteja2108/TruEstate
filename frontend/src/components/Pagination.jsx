import React from 'react'

export default function Pagination({ meta = {}, onChange }) {
  const { page = 1, totalPages = 1 } = meta

  function go(p) {
    if (p < 1 || p > totalPages) return
    onChange(p)
  }

  return (
    <div className="flex items-center gap-3 justify-end">
      <button onClick={() => go(page - 1)} className="px-3 py-1 rounded bg-slate-700 text-slate-200">Prev</button>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1
          return (
            <button key={p} onClick={() => go(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>{p}</button>
          )
        })}
      </div>
      <button onClick={() => go(page + 1)} className="px-3 py-1 rounded bg-slate-700 text-slate-200">Next</button>
    </div>
  )
}

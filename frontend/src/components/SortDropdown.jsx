import React from 'react'

export default function SortDropdown({ value = 'date_desc', onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-slate-300 text-xs">Sort</label>
      <select className="p-2 rounded bg-slate-800" value={value} onChange={e => onChange(e.target.value)}>
        <option value="date_desc">Date (Newest)</option>
        <option value="date_asc">Date (Oldest)</option>
        <option value="quantity_desc">Quantity (High → Low)</option>
        <option value="quantity_asc">Quantity (Low → High)</option>
        <option value="name_asc">Customer (A → Z)</option>
        <option value="name_desc">Customer (Z → A)</option>
      </select>
    </div>
  )
}

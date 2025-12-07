import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const OPTIONS = {
  regions: ['all', 'North', 'East', 'South', 'West'],
  genders: ['all', 'Male', 'Female'],
  categories: ['all', 'Residential', 'Commercial', 'Industrial'],
  payments: ['all', 'card', 'cash', 'bank_transfer']
}

export default function FilterPanel({ value = {}, onChange }) {
  const [state, setState] = useState(value)

  useEffect(() => setState(value), [value])

  function update(k, v) {
    const next = { ...state, [k]: v }
    setState(next)
  }

  function apply() { onChange(state) }
  function reset() { const empty = {}; setState(empty); onChange(empty) }

  const controls = [{ label: 'Customer Region', key: 'region', options: OPTIONS.regions }, { label: 'Gender', key: 'gender', options: OPTIONS.genders }, { label: 'Product Category', key: 'category', options: OPTIONS.categories }, { label: 'Payment', key: 'paymentMethod', options: OPTIONS.payments }]

  return (
    <motion.div initial={{ height: 'auto' }} className="">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-slate-200 font-medium">Filters</h3>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-slate-300 text-sm px-3 py-1 rounded bg-slate-700">Reset</button>
          <button onClick={apply} className="text-white text-sm px-3 py-1 rounded bg-indigo-600">Apply</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {controls.map(c => (
          <motion.div key={c.key} whileHover={{ y: -4 }} className="flex items-center gap-2 bg-slate-800/30 rounded-full px-3 py-1">
            <label className="text-slate-300 text-xs whitespace-nowrap">{c.label}</label>
            <select value={state[c.key] || 'all'} onChange={e => update(c.key, e.target.value)} className="bg-transparent text-sm text-slate-100 px-2 py-1 rounded-full outline-none">
              {c.options.map(o => <option key={o} value={o} className="text-black">{o}</option>)}
            </select>
          </motion.div>
        ))}

        <motion.div whileHover={{ y: -4 }} className="flex items-center gap-2 bg-slate-800/30 rounded-full px-3 py-1">
          <label className="text-slate-300 text-xs">Tags</label>
          <input className="bg-transparent text-sm px-2 py-1 outline-none" value={state.tags || ''} onChange={e => update('tags', e.target.value)} placeholder="e.g. garden,premium" />
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="flex items-center gap-2 bg-slate-800/30 rounded-full px-3 py-1">
          <label className="text-slate-300 text-xs">Date</label>
          <input type="date" className="bg-transparent text-sm px-2 py-1 outline-none" value={state.startDate || ''} onChange={e => update('startDate', e.target.value)} />
          <span className="text-slate-400">—</span>
          <input type="date" className="bg-transparent text-sm px-2 py-1 outline-none" value={state.endDate || ''} onChange={e => update('endDate', e.target.value)} />
        </motion.div>
      </div>
    </motion.div>
  )
}

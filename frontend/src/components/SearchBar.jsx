import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function SearchBar({ value, onChange }) {
  const [q, setQ] = useState(value || '')

  useEffect(() => setQ(value || ''), [value])

  useEffect(() => {
    const t = setTimeout(() => onChange(q), 350)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="scan-beam rounded-2xl overflow-hidden">
      <motion.div
        initial={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-700/40 to-slate-800/40"
      >
        <input
          className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-400"
          placeholder="Search customer name or phone..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button
          onClick={() => setQ('')}
          className="text-sm text-slate-300 px-3 py-1 rounded bg-slate-700/40"
        >Clear</button>
      </motion.div>
    </div>
  )
}

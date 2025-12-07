import React from 'react'
import { motion } from 'framer-motion'

export default function ZoneLayout({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`zone bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-4 ${className}`}
    >
      {children}
    </motion.div>
  )
}

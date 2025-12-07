import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function pick(item, ...keys) {
  for (const k of keys) {
    if (item[k] !== undefined && item[k] !== null) return item[k]
  }
  return ''
}

function Row({ item, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.002 }}
      className="border-b border-slate-700/40 hover:bg-slate-800/20"
    >
      <td className="px-4 py-2 whitespace-nowrap text-slate-200">{pick(item, 'transaction_id', 'id')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'date')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'customer_id', 'customerId')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-200 font-medium">{pick(item, 'customer_name', 'customerName', 'name')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'phone', 'phone_number')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'gender')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'age')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300 font-medium">{pick(item, 'category', 'product_category')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'quantity')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300 font-medium">₹{pick(item, 'final_amount', 'total_amount')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'region', 'customer_region')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'product_id')}</td>
      <td className="px-4 py-2 whitespace-nowrap text-slate-300">{pick(item, 'employee_name')}</td>
    </motion.tr>
  )
}

export default function TransactionTable({ data = [] }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="text-slate-300 uppercase bg-slate-900/50 sticky top-0 z-20 border-b border-slate-700">
            <th className="px-4 py-3 font-medium whitespace-nowrap">Transaction ID</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Customer ID</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Customer name</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Phone Number</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Gender</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Age</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Product Category</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Quantity</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Total Amount</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Customer region</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Product ID</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Employee name</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((d, i) => (
              <Row key={d.id || `${i}`} item={d} index={i} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

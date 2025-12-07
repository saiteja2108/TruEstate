import { useEffect, useState } from 'react'
import { fetchSales } from '../services/api'

// Custom hook with timeout and abort support to give clearer errors when backend is unavailable.
export default function useSales(params) {
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: 10, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    // timeout after 12s
    const timeout = setTimeout(() => controller.abort(), 12000)

    fetchSales({ ...params, _signal: controller.signal })
      .then(res => {
        if (cancelled) return
        setData(res.data || [])
        setMeta(res.meta || {})
      })
      .catch(err => {
        if (cancelled) return
        if (err.name === 'AbortError') setError(new Error('Request timed out (backend not responding)'))
        else setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
        clearTimeout(timeout)
      })

    return () => { cancelled = true; controller.abort(); clearTimeout(timeout) }
  }, [JSON.stringify(params)])

  return { data, meta, loading, error }
}

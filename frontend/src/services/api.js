const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://truestate-r3sf.onrender.com'; // fallback for production

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (k === '_signal') return; // internal only
    if (v === undefined || v === null || v === '') return;
    qs.set(k, String(v));
  });
  return qs.toString();
}

export async function fetchSales(params = {}) {
  const q = buildQuery(params);
  const url = `${API_BASE}/api/sales${q ? `?${q}` : ''}`;
  const opts = {};
  if (params._signal) opts.signal = params._signal;
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`Failed to fetch sales (${res.status})`);
  return res.json();
}

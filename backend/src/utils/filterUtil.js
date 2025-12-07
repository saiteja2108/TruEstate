const { parseISO, isWithinInterval } = require('date-fns');

function matchSearch(item, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    (item.customer_name || '').toLowerCase().includes(s) ||
    (item.phone || '').toLowerCase().includes(s)
  );
}

function applyFilters(data, opts = {}) {
  return data.filter(item => {
    if (!matchSearch(item, opts.q)) return false;
    if (opts.region && opts.region !== 'all' && item.region !== opts.region) return false;
    if (opts.gender && opts.gender !== 'all' && item.gender !== opts.gender) return false;
    if (opts.ageMin != null && item.age < opts.ageMin) return false;
    if (opts.ageMax != null && item.age > opts.ageMax) return false;
    if (opts.category && opts.category !== 'all' && item.category !== opts.category) return false;
    if (opts.paymentMethod && opts.paymentMethod !== 'all' && item.payment_method !== opts.paymentMethod) return false;
    if (opts.tags) {
      const wanted = opts.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      if (wanted.length) {
        const lowerTags = (item.tags || []).map(t => t.toLowerCase());
        const hasOne = wanted.every(w => lowerTags.includes(w));
        if (!hasOne) return false;
      }
    }
    if (opts.startDate || opts.endDate) {
      try {
        const date = parseISO(item.date);
        const start = opts.startDate ? parseISO(opts.startDate) : new Date(-8640000000000000);
        const end = opts.endDate ? parseISO(opts.endDate) : new Date(8640000000000000);
        if (!isWithinInterval(date, { start, end })) return false;
      } catch (e) {
        // ignore parse issues
      }
    }

    return true;
  });
}

module.exports = { applyFilters };

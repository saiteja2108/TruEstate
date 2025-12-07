function paginate(data, page = 1, perPage = 10) {
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(1, page), totalPages);
  const start = (p - 1) * perPage;
  const end = start + perPage;
  return {
    page: p,
    perPage,
    total,
    totalPages,
    data: data.slice(start, end)
  };
}

module.exports = { paginate };

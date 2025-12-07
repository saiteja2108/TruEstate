function sortData(data, sortKey) {
  const copy = data.slice();
  if (sortKey === 'date_desc') {
    copy.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortKey === 'date_asc') {
    copy.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortKey === 'quantity_desc') {
    copy.sort((a, b) => b.quantity - a.quantity);
  } else if (sortKey === 'quantity_asc') {
    copy.sort((a, b) => a.quantity - b.quantity);
  } else if (sortKey === 'name_asc') {
    copy.sort((a, b) => (a.customer_name || '').localeCompare(b.customer_name || ''));
  } else if (sortKey === 'name_desc') {
    copy.sort((a, b) => (b.customer_name || '').localeCompare(a.customer_name || ''));
  }
  return copy;
}

module.exports = { sortData };

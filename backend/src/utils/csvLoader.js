const fs = require('fs');
const { parse } = require('csv-parse/sync');
let cachedData = [];

function normalizeRow(row) {
  // Normalize CSV row values and types
  return {
    id: row.id,
    date: row.date,
    customer_id: row.customer_id || row.id,
    customer_name: row.customer_name,
    phone: row.phone,
    gender: row.gender,
    age: row.age ? Number(row.age) : null,
    region: row.region,
    customer_type: row.customer_type || '',
    product_id: row.product_id || '',
    product_name: row.product_name || '',
    brand: row.brand || '',
    category: row.category || row.product_category || '',
    tags: row.tags ? row.tags.split(/;|,/) .map(t => t.trim()).filter(Boolean) : [],
    quantity: row.quantity ? Number(row.quantity) : 0,
    price_per_unit: row.price_per_unit ? Number(row.price_per_unit) : 0,
    discount_percentage: row.discount_percentage ? Number(row.discount_percentage) : 0,
    total_amount: row.total_amount ? Number(row.total_amount) : 0,
    final_amount: row.final_amount ? Number(row.final_amount) : 0,
    payment_method: row.payment_method || '',
    order_status: row.order_status || '',
    delivery_type: row.delivery_type || '',
    store_id: row.store_id || '',
    store_location: row.store_location || '',
    salesperson_id: row.salesperson_id || '',
    employee_name: row.employee_name || ''
  };
}

async function loadCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const records = parse(raw, { columns: true, skip_empty_lines: true });
  cachedData = records.map(normalizeRow);
  return cachedData;
}

function getData() {
  return cachedData.slice();
}

module.exports = { loadCsv, getData };

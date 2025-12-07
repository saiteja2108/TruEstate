const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

let db = null;

function init(dbPath) {
  if (db) return db;
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database not found. Run scripts/import_csv_to_sqlite.js to create the DB at: ' + dbPath);
  }
  db = new Database(dbPath, { readonly: true });
  return db;
}

function buildWhere(params, values) {
  const clauses = [];
  if (params.q) {
    clauses.push("(LOWER(customer_name) LIKE '%' || LOWER(@q) || '%' OR phone_number LIKE '%' || @q || '%')");
    values['q'] = params.q;
  }
  if (params.region && params.region !== 'all') {
    clauses.push('customer_region = @region');
    values['region'] = params.region;
  }
  if (params.gender && params.gender !== 'all') {
    clauses.push('gender = @gender');
    values['gender'] = params.gender;
  }
  if (params.ageMin) {
    clauses.push('age >= @ageMin');
    values['ageMin'] = Number(params.ageMin);
  }
  if (params.ageMax) {
    clauses.push('age <= @ageMax');
    values['ageMax'] = Number(params.ageMax);
  }
  if (params.category && params.category !== 'all') {
    clauses.push('product_category = @category');
    values['category'] = params.category;
  }
  if (params.paymentMethod && params.paymentMethod !== 'all') {
    clauses.push('payment_method = @paymentMethod');
    values['paymentMethod'] = params.paymentMethod;
  }
  if (params.tags) {
    // simple approach: require all tags exist using LIKE checks
    const tags = params.tags.split(',').map(t => t.trim()).filter(Boolean);
    tags.forEach((t, i) => {
      const key = `tag${i}`;
      clauses.push(`LOWER(tags) LIKE '%' || LOWER(@${key}) || '%'`);
      values[key] = t;
    });
  }
  if (params.startDate) {
    clauses.push('date >= @startDate');
    values['startDate'] = params.startDate;
  }
  if (params.endDate) {
    clauses.push('date <= @endDate');
    values['endDate'] = params.endDate;
  }

  return clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
}

function buildOrder(sort) {
  switch (sort) {
    case 'date_asc': return 'ORDER BY date ASC';
    case 'quantity_desc': return 'ORDER BY quantity DESC';
    case 'quantity_asc': return 'ORDER BY quantity ASC';
    case 'name_asc': return "ORDER BY customer_name COLLATE NOCASE ASC";
    case 'name_desc': return "ORDER BY customer_name COLLATE NOCASE DESC";
    case 'date_desc':
    default:
      return 'ORDER BY date DESC';
  }
}

function querySales(params, dbPath) {
  const database = db || init(dbPath);
  const page = params.page ? Number(params.page) : 1;
  const perPage = params.perPage ? Number(params.perPage) : 10;

  const values = {};
  const where = buildWhere(params, values);
  const order = buildOrder(params.sort || 'date_desc');

  const countSql = `SELECT COUNT(*) as cnt, SUM(final_amount) as totalAmount, SUM(COALESCE(quantity * price_per_unit - final_amount, 0)) as totalDiscount FROM sales ${where}`;
  const countStmt = database.prepare(countSql);
  const countResult = countStmt.get(values);
  const total = countResult.cnt;
  const totalAmount = countResult.totalAmount || 0;
  const totalDiscount = countResult.totalDiscount || 0;

  const offset = (page - 1) * perPage;
  const dataSql = `SELECT * FROM sales ${where} ${order} LIMIT @limit OFFSET @offset`;
  values['limit'] = perPage;
  values['offset'] = offset;

  const dataStmt = database.prepare(dataSql);
  const rows = dataStmt.all(values);

  // Map DB columns to frontend-friendly keys to avoid mismatches.
  const mapped = rows.map(r => ({
    id: r.id,
    date: r.date,
    customer_id: r.customer_id,
    customer_name: r.customer_name,
    phone: r.phone_number,
    gender: r.gender,
    age: r.age,
    region: r.customer_region,
    customer_type: r.customer_type,
    product_id: r.product_id,
    product_name: r.product_name,
    brand: r.brand,
    category: r.product_category,
    tags: r.tags ? r.tags.split(/;|,/) .map(t => t.trim()).filter(Boolean) : [],
    quantity: r.quantity,
    price_per_unit: r.price_per_unit,
    discount_percentage: r.discount_percentage,
    total_amount: r.total_amount,
    final_amount: r.final_amount,
    payment_method: r.payment_method,
    order_status: r.order_status,
    delivery_type: r.delivery_type,
    store_id: r.store_id,
    store_location: r.store_location,
    salesperson_id: r.salesperson_id,
    employee_name: r.employee_name
  }))

  return {
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100
    },
    data: mapped
  };
}

module.exports = { init, querySales };

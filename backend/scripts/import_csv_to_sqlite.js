// Usage: node import_csv_to_sqlite.js ../data/sales.csv ../data/sales.db
// This script imports a CSV into SQLite using better-sqlite3 for fast inserts.
const fs = require('fs');
const path = require('path');
const { parse }= require('csv-parse');
const Database = require('better-sqlite3');

const argv = process.argv.slice(2);
const csvPath = argv[0] || path.join(__dirname, '..', 'data', 'sales.csv');
const dbPath = argv[1] || path.join(__dirname, '..', 'data', 'sales.db');

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found:', csvPath);
  process.exit(1);
}

console.log('Importing', csvPath, '->', dbPath);

if (fs.existsSync(dbPath)) {
  console.log('Removing existing DB at', dbPath);
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create table - columns mirror the CSV header. Use TEXT for most fields, numeric for numbers.
db.exec(`
CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  date TEXT,
  customer_id TEXT,
  customer_name TEXT,
  phone_number TEXT,
  gender TEXT,
  age INTEGER,
  customer_region TEXT,
  customer_type TEXT,
  product_id TEXT,
  product_name TEXT,
  brand TEXT,
  product_category TEXT,
  tags TEXT,
  quantity INTEGER,
  price_per_unit REAL,
  discount_percentage REAL,
  total_amount REAL,
  final_amount REAL,
  payment_method TEXT,
  order_status TEXT,
  delivery_type TEXT,
  store_id TEXT,
  store_location TEXT,
  salesperson_id TEXT,
  employee_name TEXT
);
`);

const insertStmt = db.prepare(`
INSERT INTO sales (
  id,date,customer_id,customer_name,phone_number,gender,age,customer_region,customer_type,
  product_id,product_name,brand,product_category,tags,quantity,price_per_unit,discount_percentage,
  total_amount,final_amount,payment_method,order_status,delivery_type,store_id,store_location,salesperson_id,employee_name
) VALUES (
  @id,@date,@customer_id,@customer_name,@phone_number,@gender,@age,@customer_region,@customer_type,
  @product_id,@product_name,@brand,@product_category,@tags,@quantity,@price_per_unit,@discount_percentage,
  @total_amount,@final_amount,@payment_method,@order_status,@delivery_type,@store_id,@store_location,@salesperson_id,@employee_name
)
`);

const insertMany = db.transaction((rows) => {
  for (const r of rows) insertStmt.run(r);
});

const stream = fs.createReadStream(csvPath);
const parser = parse({ columns: true, skip_empty_lines: true, trim: true });

let buffer = [];
const BATCH_SIZE = 5000;

parser.on('readable', () => {
  let record;
  while ((record = parser.read()) !== null) {
    // Normalize keys to our DB column names from the header
    const row = {
      id: record['Transaction ID'] || record['id'] || record['ID'] || null,
      date: record['Date'] || record['date'] || '',
      customer_id: record['Customer ID'] || record['customer_id'] || '',
      customer_name: record['Customer Name'] || record['customer_name'] || '',
      phone_number: record['Phone Number'] || record['phone'] || record['phone_number'] || '',
      gender: record['Gender'] || record['gender'] || '',
      age: record['Age'] ? Number(record['Age']) : null,
      customer_region: record['Customer Region'] || record['region'] || '',
      customer_type: record['Customer Type'] || record['customer_type'] || '',
      product_id: record['Product ID'] || record['product_id'] || '',
      product_name: record['Product Name'] || record['product_name'] || '',
      brand: record['Brand'] || record['brand'] || '',
      product_category: record['Product Category'] || record['category'] || '',
      tags: (record['Tags'] || record['tags'] || '').toString(),
      quantity: record['Quantity'] ? Number(record['Quantity']) : 0,
      price_per_unit: record['Price per Unit'] ? Number(record['Price per Unit']) : (record['price_per_unit'] ? Number(record['price_per_unit']) : 0),
      discount_percentage: record['Discount Percentage'] ? Number(record['Discount Percentage']) : 0,
      total_amount: record['Total Amount'] ? Number(record['Total Amount']) : 0,
      final_amount: record['Final Amount'] ? Number(record['Final Amount']) : 0,
      payment_method: record['Payment Method'] || record['payment_method'] || '',
      order_status: record['Order Status'] || record['order_status'] || '',
      delivery_type: record['Delivery Type'] || record['delivery_type'] || '',
      store_id: record['Store ID'] || record['store_id'] || '',
      store_location: record['Store Location'] || record['store_location'] || '',
      salesperson_id: record['Salesperson ID'] || record['salesperson_id'] || '',
      employee_name: record['Employee Name'] || record['employee_name'] || ''
    };

    buffer.push(row);
    if (buffer.length >= BATCH_SIZE) {
      insertMany(buffer);
      buffer = [];
      console.log('Inserted batch...');
    }
  }
});

parser.on('end', () => {
  if (buffer.length) insertMany(buffer);
  console.log('Import complete. Creating indexes...');
  db.exec('CREATE INDEX idx_date ON sales(date);');
  db.exec('CREATE INDEX idx_customer_name ON sales(customer_name);');
  db.exec('CREATE INDEX idx_phone ON sales(phone_number);');
  db.exec('CREATE INDEX idx_region ON sales(customer_region);');
  db.exec('CREATE INDEX idx_category ON sales(product_category);');
  db.exec('CREATE INDEX idx_payment ON sales(payment_method);');
  console.log('Indexes created. DB ready at', dbPath);
  db.close();
});

parser.on('error', (err) => {
  console.error('CSV parse error', err);
  process.exit(1);
});

stream.pipe(parser);

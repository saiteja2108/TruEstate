const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/sales');
const path = require('path');
const dbUtil = require('./utils/db');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure DB exists (if not, user should run the import script)
const DB_PATH = path.join(__dirname, '..', 'data', 'sales.db');

try {
  dbUtil.init(DB_PATH);
  app.use('/api/sales', salesRoutes);

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`TruEstate backend running on http://localhost:${port}`);
  });
} catch (err) {
  console.error('Database initialization error:', err.message);
  console.error('Run `node backend/scripts/import_csv_to_sqlite.js` to create the DB from your CSV.');
  process.exit(1);
}

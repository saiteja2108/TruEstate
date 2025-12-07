const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/sales');
const path = require('path');
const fs = require('fs');
const https = require('https');
const dbUtil = require('./utils/db');

const app = express();
app.use(cors());
app.use(express.json());

// Auto-download sales.db if SALES_DB_URL env var is set and file is missing
const DB_PATH = path.join(__dirname, '..', 'data', 'sales.db');
const DATA_DIR = path.dirname(DB_PATH);

async function ensureDB() {
  // If DB exists locally, use it
  if (fs.existsSync(DB_PATH)) {
    return true;
  }

  // Try to download from SALES_DB_URL if set
  const dbUrl = process.env.SALES_DB_URL;
  if (dbUrl) {
    console.log(`Downloading sales.db from ${dbUrl}...`);
    try {
      // Ensure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Download file
      const file = fs.createWriteStream(DB_PATH);
      return new Promise((resolve, reject) => {
        https.get(dbUrl, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Database downloaded successfully');
            resolve(true);
          });
        }).on('error', (err) => {
          fs.unlink(DB_PATH, () => {}); // Delete incomplete file
          reject(err);
        });
      });
    } catch (err) {
      console.error('Failed to download database:', err.message);
      return false;
    }
  }

  // If no URL and no local DB, error
  return false;
}

// Initialize and start server
ensureDB().then((success) => {
  if (!success) {
    console.error('Database not found and SALES_DB_URL not set.');
    console.error('To fix: run `node backend/scripts/import_csv_to_sqlite.js` or set SALES_DB_URL environment variable.');
    process.exit(1);
  }

  try {
    dbUtil.init(DB_PATH);
    app.use('/api/sales', salesRoutes);

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`TruEstate backend running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Database initialization error:', err.message);
    process.exit(1);
  }
}).catch((err) => {
  console.error('Startup error:', err.message);
  process.exit(1);
});

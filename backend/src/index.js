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

// Paths
const DB_PATH = path.join(__dirname, '..', 'data', 'sales.db');
const CSV_PATH = path.join(__dirname, '..', 'data', 'sales.csv');
const ZIP_PATH = path.join(__dirname, '..', 'data', 'sales-db.zip');
const DATA_DIR = path.dirname(DB_PATH);

// Lazy require unzipper (added to backend/package.json)
let unzipper;
try {
  unzipper = require('unzipper');
} catch (e) {
  unzipper = null;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const getter = url.startsWith('https') ? https.get : require('http').get;
    const file = fs.createWriteStream(dest);
    getter(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirects
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error('Download failed: ' + response.statusCode));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function runImporter(csvPath, dbPath) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const importer = spawn(process.execPath, [path.join(__dirname, '..', 'scripts', 'import_csv_to_sqlite.js'), csvPath, dbPath], { stdio: 'inherit' });
    importer.on('close', (code) => {
      if (code === 0) resolve(true);
      else reject(new Error('Importer exited with code ' + code));
    });
  });
}

async function ensureDB() {
  try {
    // On Render, always refresh DB from remote URL
    // (process.env.RENDER is set by Render automatically)
    if (process.env.RENDER) {
      if (fs.existsSync(DB_PATH)) {
        console.log('On Render: deleting existing DB so it can be refreshed from remote URL...');
        try {
          fs.unlinkSync(DB_PATH);
        } catch (e) {
          console.error('Failed to delete existing DB on Render:', e.message);
        }
      }
    } else if (fs.existsSync(DB_PATH)) {
      // Local dev: keep existing DB, don't re-download every time
      return true;
    }

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    // If SALES_DB_URL provided, download; if it's a zip, unzip it
    if (process.env.SALES_DB_URL) {
      const url = process.env.SALES_DB_URL;
      console.log('Downloading SALES_DB_URL:', url);
      const isZip = url.toLowerCase().endsWith('.zip');
      const dest = isZip ? ZIP_PATH : DB_PATH;
      await downloadFile(url, dest);
      if (isZip) {
        if (!unzipper) throw new Error('unzipper module not available; install dependencies');
        console.log('Unzipping downloaded DB...');
        await new Promise((resolve, reject) => {
          const readStream = fs.createReadStream(ZIP_PATH);
          readStream
            .pipe(unzipper.ParseOne())
            .pipe(fs.createWriteStream(DB_PATH))
            .on('finish', resolve)
            .on('error', reject);
        });
        console.log('Unzip complete.');
        try { fs.unlinkSync(ZIP_PATH); } catch (e) {}
      }
      return true;
    }

    // If SALES_CSV_URL provided, download CSV and run importer
    if (process.env.SALES_CSV_URL) {
      const url = process.env.SALES_CSV_URL;
      console.log('Downloading SALES_CSV_URL:', url);
      await downloadFile(url, CSV_PATH);
      console.log('CSV downloaded to', CSV_PATH);
      console.log('Running importer to build SQLite DB (may take several minutes)...');
      await runImporter(CSV_PATH, DB_PATH);
      console.log('Importer finished, DB created at', DB_PATH);
      return true;
    }

    console.error('No SALES_DB_URL or SALES_CSV_URL provided and no local DB found.');
    return false;
  } catch (err) {
    console.error('Error ensuring DB:', err && err.message ? err.message : err);
    return false;
  }
}


// Initialize and start server
ensureDB().then((ok) => {
  if (!ok) {
    console.error('Database initialization failed. Set SALES_CSV_URL or SALES_DB_URL, or run the importer locally.');
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
  console.error('Startup error:', err && err.message ? err.message : err);
  process.exit(1);
});

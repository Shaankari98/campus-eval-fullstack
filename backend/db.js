// db.js - simple wrapper around better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.sqlite'), { verbose: console.log });

// initialize schema if not present
function init() {
  // candidates table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      college TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // evaluations table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      candidate_id TEXT NOT NULL,
      round TEXT,
      score INTEGER,
      comments TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
    )
  `).run();
}

init();

module.exports = db;


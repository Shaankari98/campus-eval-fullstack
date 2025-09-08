// seed.js - adds sample data if DB is empty
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const count = db.prepare(`SELECT COUNT(*) as c FROM candidates`).get().c;
if (count > 0) {
  console.log('DB already seeded');
  process.exit(0);
}

const cand1 = uuidv4();
const cand2 = uuidv4();

db.prepare(`INSERT INTO candidates (id, name, email, college, created_at) VALUES (?, ?, ?, ?, ?)`)
  .run(cand1, 'Aisha Kumar', 'aisha@example.com', 'IIT Example', new Date().toISOString());

db.prepare(`INSERT INTO candidates (id, name, email, college, created_at) VALUES (?, ?, ?, ?, ?)`)
  .run(cand2, 'Rahul Verma', 'rahul@example.com', 'NIT Example', new Date().toISOString());

db.prepare(`INSERT INTO evaluations (id, candidate_id, round, score, comments, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
  .run(uuidv4(), cand1, 'Coding', 85, 'Strong DS&A', new Date().toISOString());

db.prepare(`INSERT INTO evaluations (id, candidate_id, round, score, comments, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
  .run(uuidv4(), cand2, 'HR', 70, 'Good communication', new Date().toISOString());

console.log('Seeded sample data');

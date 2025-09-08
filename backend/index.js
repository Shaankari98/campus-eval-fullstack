// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helpers
function nowIso() { return new Date().toISOString(); }

// --- Candidates ---
// GET /api/candidates
app.get('/api/candidates', (req, res) => {
  const rows = db.prepare(`SELECT * FROM candidates ORDER BY created_at DESC`).all();
  res.json(rows);
});

// GET /api/candidates/:id
app.get('/api/candidates/:id', (req, res) => {
  const row = db.prepare(`SELECT * FROM candidates WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Candidate not found' });
  // fetch evaluations
  const evals = db.prepare(`SELECT * FROM evaluations WHERE candidate_id = ? ORDER BY created_at DESC`).all(req.params.id);
  res.json({ ...row, evaluations: evals });
});

// POST /api/candidates
app.post('/api/candidates', (req, res) => {
  const { name, email, college } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const id = uuidv4();
  try {
    db.prepare(`INSERT INTO candidates (id, name, email, college, created_at) VALUES (?, ?, ?, ?, ?)`)
      .run(id, name, email || null, college || null, nowIso());
    const created = db.prepare(`SELECT * FROM candidates WHERE id = ?`).get(id);
    res.status(201).json(created);
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'db error' });
    }
  }
});

// PUT /api/candidates/:id
app.put('/api/candidates/:id', (req, res) => {
  const { name, email, college } = req.body;
  const id = req.params.id;
  const existing = db.prepare(`SELECT * FROM candidates WHERE id = ?`).get(id);
  if (!existing) return res.status(404).json({ error: 'not found' });
  db.prepare(`UPDATE candidates SET name = ?, email = ?, college = ? WHERE id = ?`)
    .run(name || existing.name, email || existing.email, college || existing.college, id);
  const updated = db.prepare(`SELECT * FROM candidates WHERE id = ?`).get(id);
  res.json(updated);
});

// DELETE /api/candidates/:id
app.delete('/api/candidates/:id', (req, res) => {
  const id = req.params.id;
  db.prepare(`DELETE FROM candidates WHERE id = ?`).run(id);
  res.json({ ok: true });
});

// --- Evaluations ---
// POST /api/candidates/:id/evaluations
app.post('/api/candidates/:id/evaluations', (req, res) => {
  const candidate_id = req.params.id;
  const { round, score, comments } = req.body;
  const cand = db.prepare(`SELECT id FROM candidates WHERE id = ?`).get(candidate_id);
  if (!cand) return res.status(404).json({ error: 'candidate not found' });
  const id = uuidv4();
  db.prepare(`INSERT INTO evaluations (id, candidate_id, round, score, comments, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(id, candidate_id, round || null, score != null ? score : null, comments || null, nowIso());
  const created = db.prepare(`SELECT * FROM evaluations WHERE id = ?`).get(id);
  res.status(201).json(created);
});

// GET /api/evaluations/:id
app.get('/api/evaluations/:id', (req, res) => {
  const e = db.prepare(`SELECT * FROM evaluations WHERE id = ?`).get(req.params.id);
  if (!e) return res.status(404).json({ error: 'evaluation not found' });
  res.json(e);
});

// PUT /api/evaluations/:id
app.put('/api/evaluations/:id', (req, res) => {
  const { round, score, comments } = req.body;
  const existing = db.prepare(`SELECT * FROM evaluations WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'not found' });
  db.prepare(`UPDATE evaluations SET round = ?, score = ?, comments = ? WHERE id = ?`)
    .run(round || existing.round, score != null ? score : existing.score, comments || existing.comments, req.params.id);
  const updated = db.prepare(`SELECT * FROM evaluations WHERE id = ?`).get(req.params.id);
  res.json(updated);
});

// DELETE /api/evaluations/:id
app.delete('/api/evaluations/:id', (req, res) => {
  db.prepare(`DELETE FROM evaluations WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', now: nowIso() }));

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

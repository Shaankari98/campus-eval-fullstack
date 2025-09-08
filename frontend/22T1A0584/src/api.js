const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchCandidates() {
  const r = await fetch(`${BASE}/api/candidates`);
  return r.json();
}

export async function fetchCandidate(id) {
  const r = await fetch(`${BASE}/api/candidates/${id}`);
  return r.json();
}

export async function createCandidate(payload) {
  const r = await fetch(`${BASE}/api/candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

export async function createEvaluation(candidateId, payload) {
  const r = await fetch(`${BASE}/api/candidates/${candidateId}/evaluations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

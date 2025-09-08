import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCandidate, createEvaluation } from '../api'

export default function CandidateDetail() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)

  // new evaluation
  const [round, setRound] = useState('')
  const [score, setScore] = useState('')
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchCandidate(id).then(data => {
      setCandidate(data)
      setLoading(false)
    }).catch(err => { console.error(err); setLoading(false) })
  }, [id, saving]) // re-fetch after saving

  async function addEval(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createEvaluation(id, { round, score: parseInt(score, 10), comments })
      setRound(''); setScore(''); setComments('')
    } catch (err) {
      console.error(err); alert('Could not add evaluation')
    } finally { setSaving(false) }
  }

  if (loading) return <div>Loading...</div>
  if (!candidate) return <div>Candidate not found</div>

  return (
    <div>
      <h2>{candidate.name}</h2>
      <div style={{ color: '#555' }}>{candidate.email} • {candidate.college}</div>

      <section style={{ marginTop: 20 }}>
        <h3>Evaluations</h3>
        {candidate.evaluations && candidate.evaluations.length > 0 ? (
          <ul>
            {candidate.evaluations.map(ev => (
              <li key={ev.id} style={{ marginBottom: 8 }}>
                <strong>{ev.round || 'Round'}</strong> — Score: {ev.score ?? 'N/A'}
                <div style={{ fontSize: 13 }}>{ev.comments}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{new Date(ev.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : <div>No evaluations yet.</div>}
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Add Evaluation</h3>
        <form onSubmit={addEval}>
          <div style={{ marginBottom: 8 }}>
            <label>Round</label><br />
            <input value={round} onChange={e => setRound(e.target.value)} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Score</label><br />
            <input value={score} onChange={e => setScore(e.target.value)} type="number" />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Comments</label><br />
            <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Evaluation'}</button>
        </form>
      </section>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCandidates } from '../api'

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidates().then(data => {
      setCandidates(data)
      setLoading(false)
    }).catch(err => {
      console.error(err); setLoading(false)
    })
  }, [])

  return (
    <div>
      <h2>Candidates</h2>
      {loading ? <div>Loading...</div> : null}
      <div style={{ marginTop: 12 }}>
        {candidates.length === 0 && !loading && <div>No candidates yet. Add one.</div>}
        <ul>
          {candidates.map(c => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <Link to={`/candidate/${c.id}`}><strong>{c.name}</strong></Link>
              <div style={{ fontSize: 13, color: '#555' }}>{c.email} • {c.college}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


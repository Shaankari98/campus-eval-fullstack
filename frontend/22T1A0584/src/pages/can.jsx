import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCandidate } from '../api'

export default function NewCandidate() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [college, setCollege] = useState('')
  const [saving, setSaving] = useState(false)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const created = await createCandidate({ name, email, college })
      // go to detail
      nav(`/candidate/${created.id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to create')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <h2>Add Candidate</h2>
      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Name</label><br />
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>College</label><br />
          <input value={college} onChange={e => setCollege(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Candidate'}</button>
      </form>
    </div>
  )
}

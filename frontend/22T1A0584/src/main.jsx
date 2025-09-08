import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Candidates from './pages/Candidates'
import CandidateDetail from './pages/CandidateDetail'
import NewCandidate from './pages/NewCandidate'

function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'system-ui, Roboto, Arial' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Campus Hiring — Evaluations</h1>
          <nav>
            <Link to="/" style={{ marginRight: 12 }}>Candidates</Link>
            <Link to="/new">Add candidate</Link>
          </nav>
        </header>

        <main style={{ marginTop: 20 }}>
          <Routes>
            <Route path="/" element={<Candidates />} />
            <Route path="/candidate/:id" element={<CandidateDetail />} />
            <Route path="/new" element={<NewCandidate />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)


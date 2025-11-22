import { useEffect, useState } from 'react'
import { api } from '../utils/api'

function GameCard({ title, onPlay, description }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200">
      <div className="text-lg font-semibold mb-2">{title}</div>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <button onClick={onPlay} className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white">Play</button>
    </div>
  )
}

// Simple tile match: click two tiles to find pairs
function TilesMatch({ user, onDone }) {
  const [tiles, setTiles] = useState([])
  const [opened, setOpened] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [start] = useState(Date.now())

  useEffect(() => {
    const symbols = ['🍎','🍌','🍇','🍓','🍍','🥝','🍑','🍒']
    const pairs = [...symbols, ...symbols]
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]]
    }
    setTiles(pairs)
  }, [])

  useEffect(() => {
    if (opened.length === 2) {
      setTimeout(() => {
        const [a, b] = opened
        if (tiles[a] === tiles[b]) {
          setMatched(prev => new Set([...prev, a, b]))
        }
        setOpened([])
        setMoves(m => m + 1)
      }, 600)
    }
  }, [opened])

  useEffect(() => {
    if (tiles.length && matched.size === tiles.length) {
      const duration = Math.round((Date.now() - start) / 1000)
      const score = Math.max(10, 200 - moves * 10)
      onDone(score, duration)
    }
  }, [matched])

  return (
    <div className="grid grid-cols-4 gap-3">
      {tiles.map((t, i) => {
        const isOpen = opened.includes(i) || matched.has(i)
        return (
          <button key={i} onClick={() => {
            if (isOpen || opened.length === 2) return
            setOpened(o => [...o, i])
          }} className={`h-16 rounded-lg flex items-center justify-center text-2xl transition-all ${isOpen ? 'bg-emerald-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
            {isOpen ? t : '❓'}
          </button>
        )
      })}
    </div>
  )
}

// Simple car parking puzzle: move car to exit by clicking steps (toy version)
function CarParking({ onDone }) {
  const [steps, setSteps] = useState(0)
  const [pos, setPos] = useState(0)
  const start = Date.now()
  return (
    <div className="space-y-4">
      <div className="h-3 bg-slate-700 rounded overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${(pos/9)*100}%` }} />
      </div>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({length:10}).map((_,i)=> (
          <button key={i} className={`h-10 rounded ${i<=pos? 'bg-blue-500' : 'bg-slate-700'}`} onClick={() => {
            if (i===pos+1) { setPos(i); setSteps(s=>s+1); if (i===9) { const score = Math.max(10, 200-steps*5); const duration=Math.round((Date.now()-start)/1000); onDone(score, duration) } }
          }} />
        ))}
      </div>
      <div className="text-slate-300 text-sm">Tap squares sequentially to guide the car to exit.</div>
    </div>
  )
}

// Simple word spelling: type target word quickly
function WordSpelling({ onDone }) {
  const words = ['crypto','token','wallet','puzzle','reward','toncoin','ledger','market']
  const [target] = useState(words[Math.floor(Math.random()*words.length)])
  const [value, setValue] = useState('')
  const [start] = useState(Date.now())

  useEffect(() => {
    if (value === target) {
      const duration = Math.round((Date.now()-start)/1000)
      const score = Math.max(10, 200 - duration*20)
      onDone(score, duration)
    }
  }, [value])

  return (
    <div className="space-y-4">
      <div className="text-slate-200">Type the word:</div>
      <div className="text-2xl font-mono text-white">{target}</div>
      <input autoFocus value={value} onChange={e=>setValue(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" placeholder="start typing..." />
    </div>
  )
}

export default function Games({ user, onClose }) {
  const [mode, setMode] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const done = async (score, duration) => {
    if (!user) return
    setSubmitting(true)
    try {
      await api.submitScore(user.username, mode, score, duration)
      const profile = await api.me(user.username)
      localStorage.setItem('user', JSON.stringify(profile))
      window.location.reload()
    } catch (e) {
      alert(e.message)
    } finally { setSubmitting(false) }
  }

  if (!mode) {
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        <GameCard title="Tiles Matching" description="Find all pairs in the least moves." onPlay={async ()=>{ setMode('tiles'); if(user) await api.startSession(user.username, 'tiles') }} />
        <GameCard title="Car Parking" description="Guide the car to the exit step by step." onPlay={async ()=>{ setMode('parking'); if(user) await api.startSession(user.username, 'parking') }} />
        <GameCard title="Word Spelling" description="Type the target word as fast as you can." onPlay={async ()=>{ setMode('word'); if(user) await api.startSession(user.username, 'word') }} />
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200">
      {mode==='tiles' && <TilesMatch user={user} onDone={done} />}
      {mode==='parking' && <CarParking onDone={done} />}
      {mode==='word' && <WordSpelling onDone={done} />}
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-2 rounded bg-slate-700 text-white" onClick={()=>setMode(null)} disabled={submitting}>Back</button>
        <button className="px-3 py-2 rounded bg-slate-700 text-white" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

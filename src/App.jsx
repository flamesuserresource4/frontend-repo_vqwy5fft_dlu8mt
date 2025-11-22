import { useEffect, useState } from 'react'
import Header from './components/Header'
import Games from './components/Games'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [openGames, setOpenGames] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Header user={user} setUser={setUser} />

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Play & Earn Points</h1>
              <p className="text-slate-300 text-sm">Enjoy mini-puzzles and collect points you can request to withdraw to your TON wallet as an off-platform process.</p>
            </div>
            <button onClick={()=>setOpenGames(true)} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Start Playing</button>
          </div>
        </div>

        <Dashboard user={user} />

        {openGames && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-full max-w-2xl">
              <Games user={user} onClose={()=>setOpenGames(false)} />
            </div>
          </div>
        )}

        <div className="text-center text-xs text-slate-400 pt-4">
          This app awards points for fun. It does not distribute real cryptocurrency on-chain. Any withdrawal is a manual process and subject to review.
        </div>
      </div>
    </div>
  )
}

export default App

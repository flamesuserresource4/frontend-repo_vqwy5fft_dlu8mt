import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { Crown } from 'lucide-react'

export default function Dashboard({ user }) {
  const [me, setMe] = useState(null)
  const [leaders, setLeaders] = useState([])

  const load = async () => {
    if (user) {
      const profile = await api.me(user.username)
      setMe(profile)
    }
    const lb = await api.leaderboard()
    setLeaders(lb)
  }

  useEffect(()=>{ load() }, [user])

  if (!user) return (
    <div className="text-slate-300">Create a profile to start playing and earning points.</div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200">
        <div className="text-lg font-semibold mb-2">Your Rewards</div>
        <div className="mb-2">Balance: <span className="font-bold text-yellow-300">{me?.balance ?? 0} pts</span></div>
        <div className="space-y-2 max-h-60 overflow-auto">
          {(me?.rewards || []).map((r,i)=> (
            <div key={i} className="text-sm flex justify-between border-b border-slate-700/60 pb-1">
              <span>{r.game} +{r.points_awarded} pts</span>
              <span className="text-slate-400">score {r.score}</span>
            </div>
          ))}
          {!me?.rewards?.length && <div className="text-slate-400 text-sm">No rewards yet. Play a game!</div>}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200">
        <div className="flex items-center gap-2 text-lg font-semibold mb-2"><Crown className="text-yellow-300"/>Leaderboard</div>
        <div className="space-y-2">
          {leaders.map((l,i)=> (
            <div key={i} className="flex justify-between text-sm">
              <span>#{i+1} {l.username}</span>
              <span className="text-yellow-300">{l.points} pts</span>
            </div>
          ))}
          {!leaders.length && <div className="text-slate-400 text-sm">No entries yet.</div>}
        </div>
      </div>
    </div>
  )
}

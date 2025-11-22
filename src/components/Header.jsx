import { useEffect, useState } from 'react'
import { Trophy, Coins, Wallet } from 'lucide-react'
import { api } from '../utils/api'

export default function Header({ user, setUser }) {
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      const u = JSON.parse(saved)
      setUser(u)
      setName(u.username)
      setWallet(u.ton_address || '')
    }
  }, [])

  const save = async () => {
    if (!name.trim()) return
    await api.register(name.trim(), wallet.trim() || undefined)
    const profile = await api.me(name.trim())
    const u = { username: profile.username, ton_address: profile.ton_address, balance: profile.balance }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700">
      <div className="flex items-center gap-3">
        <Trophy className="text-yellow-400" />
        <div className="text-white font-semibold">Crypto-Reward Puzzles</div>
      </div>

      {!user ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="username" className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" />
          <input value={wallet} onChange={e=>setWallet(e.target.value)} placeholder="TON wallet (optional)" className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" />
          <button onClick={save} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Save</button>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-slate-200">
          <div className="flex items-center gap-2"><Coins className="text-yellow-300" size={18} /><span>{user.balance ?? 0} pts</span></div>
          <div className="flex items-center gap-2"><Wallet size={18} /><span className="truncate max-w-[160px]" title={user.ton_address || 'No wallet'}>{user.ton_address || 'No wallet'}</span></div>
        </div>
      )}
    </div>
  )
}

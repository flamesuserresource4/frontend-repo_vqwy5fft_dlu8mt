const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try { const d = await res.json(); msg = d.detail || d.message || msg } catch {}
    throw new Error(msg)
  }
  try { return await res.json() } catch { return null }
}

export const api = {
  base: BASE_URL,
  register: (username, ton_address, referred_by) => http('/api/register', { method: 'POST', body: JSON.stringify({ username, ton_address, referred_by }) }),
  me: (username) => http(`/api/me/${encodeURIComponent(username)}`),
  startSession: (username, game) => http('/api/start-session', { method: 'POST', body: JSON.stringify({ username, game }) }),
  submitScore: (username, game, score, duration_sec) => http('/api/submit-score', { method: 'POST', body: JSON.stringify({ username, game, score, duration_sec }) }),
  leaderboard: () => http('/api/leaderboard'),
  withdraw: (username, ton_address, points) => http('/api/withdraw', { method: 'POST', body: JSON.stringify({ username, ton_address, points }) }),
}

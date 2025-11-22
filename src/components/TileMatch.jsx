import React, { useEffect, useMemo, useState } from "react";

const EMOJIS = ["🍎","🍌","🍒","🍇","🍉","🍍","🥝","🍑"].flatMap(e => [e, e]);

export default function TileMatch({ onWin }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);

  const shuffled = useMemo(() => {
    const arr = [...EMOJIS].sort(() => Math.random() - 0.5);
    return arr.map((emoji, idx) => ({ id: idx, emoji }));
  }, []);

  useEffect(() => {
    setCards(shuffled);
  }, [shuffled]);

  useEffect(() => {
    if (matched.size === EMOJIS.length) {
      onWin?.(Math.max(20 - moves, 5));
    }
  }, [matched, moves, onWin]);

  function handleFlip(id) {
    if (flipped.length === 2 || matched.has(id) || flipped.includes(id)) return;
    setFlipped(prev => [...prev, id]);
  }

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;
      const ca = cards[a];
      const cb = cards[b];
      setMoves(m => m + 1);
      if (ca && cb && ca.emoji === cb.emoji) {
        setMatched(prev => new Set([...prev, a, b]));
        setTimeout(() => setFlipped([]), 600);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped, cards]);

  return (
    <div>
      <div className="mb-3 text-blue-200/80 text-sm">Match the pairs in as few moves as possible.</div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.has(idx);
          return (
            <button
              key={idx}
              onClick={() => handleFlip(idx)}
              className={`aspect-square rounded-xl border transition-all duration-300 flex items-center justify-center text-2xl select-none shadow-sm ${
                isFlipped ? "bg-cyan-500/20 border-cyan-400/40" : "bg-slate-800/60 border-white/10 hover:border-white/20"
              }`}
            >
              <span className={`transition-opacity ${isFlipped ? "opacity-100" : "opacity-0"}`}>{card.emoji}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-blue-200/80 text-sm">Moves: {moves}</div>
    </div>
  );
}

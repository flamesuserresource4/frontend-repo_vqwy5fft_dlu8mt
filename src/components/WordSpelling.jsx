import React, { useMemo, useState } from "react";

const WORDS = ["ADA", "BLOCK", "CHAIN", "WALLET", "NODE", "SMART", "TOKEN"];

export default function WordSpelling({ onWin }) {
  const [target] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const letters = useMemo(() => target.split("").sort(() => Math.random() - 0.5), [target]);
  const [input, setInput] = useState("");

  function check() {
    if (input.toUpperCase() === target) {
      onWin?.(10);
    }
  }

  return (
    <div>
      <div className="mb-2 text-blue-200/80 text-sm">Arrange the letters to spell the hidden word.</div>
      <div className="flex gap-2 mb-3">
        {letters.map((l, i) => (
          <div key={i} className="w-10 h-10 rounded-lg bg-slate-800/60 border border-white/10 flex items-center justify-center font-semibold text-white">
            {l}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the word"
        className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button onClick={check} className="mt-3 px-3 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white">Check</button>
      <div className="mt-2 text-blue-200/80 text-sm">Target length: {target.length}</div>
    </div>
  );
}

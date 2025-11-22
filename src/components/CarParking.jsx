import React, { useEffect, useState } from "react";

// Simple grid-based parking puzzle: move car (🚗) to exit (🏁) avoiding walls
const SIZE = 6;
const WALLS = new Set(["1,1","1,2","2,2","3,3","4,1","4,4","2,4","0,3"]);

export default function CarParking({ onWin }) {
  const [car, setCar] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const exit = { x: 5, y: 5 };

  useEffect(() => {
    if (car.x === exit.x && car.y === exit.y) {
      onWin?.(15);
    }
  }, [car, onWin]);

  function move(dx, dy) {
    const nx = car.x + dx;
    const ny = car.y + dy;
    const key = `${nx},${ny}`;
    if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) return;
    if (WALLS.has(key)) return;
    setCar({ x: nx, y: ny });
    setMoves(m => m + 1);
  }

  useEffect(() => {
    function handle(e) {
      if (e.key === "ArrowUp") move(0, -1);
      if (e.key === "ArrowDown") move(0, 1);
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return (
    <div>
      <div className="mb-3 text-blue-200/80 text-sm">Use arrow keys to reach the flag.</div>
      <div className="grid grid-cols-6 gap-1 w-64 select-none">
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isCar = car.x === x && car.y === y;
          const isExit = exit.x === x && exit.y === y;
          const isWall = WALLS.has(`${x},${y}`);
          return (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-xl border ${
                isWall
                  ? "bg-slate-700 border-slate-600"
                  : isExit
                  ? "bg-green-500/20 border-green-400/40"
                  : "bg-slate-800/60 border-white/10"
              }`}
            >
              {isCar ? "🚗" : isExit ? "🏁" : ""}
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-blue-200/80 text-sm">Moves: {moves}</div>
      <div className="mt-2 grid grid-cols-3 gap-2 w-48">
        <button className="col-span-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => move(0, -1)}>Up</button>
        <button className="py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => move(-1, 0)}>Left</button>
        <button className="py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => move(1, 0)}>Right</button>
        <button className="col-span-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => move(0, 1)}>Down</button>
      </div>
    </div>
  );
}

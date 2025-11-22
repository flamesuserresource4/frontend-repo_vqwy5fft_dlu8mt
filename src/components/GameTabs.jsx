import React from "react";

export default function GameTabs({ active, setActive }) {
  const tabs = [
    { key: "tiles", label: "Tiles Matching" },
    { key: "parking", label: "Car Parking" },
    { key: "words", label: "Word Spelling" },
  ];

  return (
    <div className="inline-flex bg-slate-800/60 border border-white/10 rounded-lg p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            active === t.key
              ? "bg-cyan-600 text-white"
              : "text-blue-200/80 hover:bg-white/5"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

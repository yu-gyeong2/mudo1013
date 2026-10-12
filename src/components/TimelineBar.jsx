import React from 'react';
import { Check, Clock, Trophy } from 'lucide-react';

export default function TimelineBar({
  rounds,
  currentRoundIndex,
  onSelectRound,
  isSettlementActive,
  onSelectSettlement,
  results,
}) {
  return (
    <div className="w-full max-w-xl mx-auto overflow-x-auto pb-1 no-scrollbar">
      <div className="flex items-center justify-between min-w-[340px] px-2 py-2 bg-slate-900/60 rounded-2xl border border-slate-800">
        
        {/* Rounds 1 to N */}
        {rounds.map((rnd, idx) => {
          const isActive = !isSettlementActive && currentRoundIndex === idx;
          const isDone = Boolean(results[rnd.id]);

          return (
            <React.Fragment key={rnd.id}>
              <button
                onClick={() => onSelectRound(idx)}
                className={`flex flex-col items-center gap-1 group transition ${
                  isActive ? 'scale-105' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition border-2 ${
                    isActive
                      ? 'bg-yellow-400 text-black border-yellow-300 shadow-md shadow-yellow-400/30'
                      : isDone
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isDone ? <Check size={14} /> : `R${idx + 1}`}
                </div>
                <span className={`text-[10px] font-bold whitespace-nowrap ${
                  isActive ? 'text-yellow-400' : 'text-slate-400'
                }`}>
                  {idx + 1}라운드
                </span>
              </button>

              {/* Connector line */}
              <div className={`flex-1 h-0.5 mx-1 transition ${
                isDone ? 'bg-emerald-500/60' : 'bg-slate-800'
              }`} />
            </React.Fragment>
          );
        })}

        {/* Final Settlement Tab */}
        <button
          onClick={onSelectSettlement}
          className={`flex flex-col items-center gap-1 group transition ${
            isSettlementActive ? 'scale-105' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition border-2 ${
              isSettlementActive
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-md shadow-yellow-400/30'
                : 'bg-slate-800 text-yellow-400 border-slate-700'
            }`}
          >
            <Trophy size={14} />
          </div>
          <span className={`text-[10px] font-bold whitespace-nowrap ${
            isSettlementActive ? 'text-yellow-400' : 'text-slate-400'
          }`}>
            최종정산
          </span>
        </button>

      </div>
    </div>
  );
}

import React from 'react';
import { Volume2, VolumeX, Share2, Settings, HelpCircle, ShieldAlert } from 'lucide-react';

export default function Header({
  isMuted,
  onToggleSound,
  onOpenRules,
  onOpenShare,
  onOpenSettings,
  onActivateSeal,
  isSealed,
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-yellow-500/30 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Title & Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0">
            <span className="font-black text-black text-lg">無</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="bg-yellow-400 text-black text-[11px] font-black px-1.5 py-0.5 rounded leading-none">
                8인 동기화
              </span>
              <span className="text-xs text-yellow-400 font-semibold tracking-wide">
                진행자 없는 실시간 레이스
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-blackhan tracking-wide text-white drop-shadow">
              무한도전 <span className="text-yellow-400">텔레파시 레이스</span>
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* 봉인하기 빠른 버튼 */}
          <button
            onClick={onActivateSeal}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isSealed
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
            }`}
            title="화면 봉인 모드"
          >
            <ShieldAlert size={14} className="shrink-0" />
            <span className="hidden sm:inline">봉인 모드</span>
          </button>

          {/* 소리 토글 */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-yellow-400" />}
          </button>

          {/* QR 공유 */}
          <button
            onClick={onOpenShare}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="친구들과 동기화 공유 (QR/링크)"
          >
            <Share2 size={16} className="text-blue-400" />
          </button>

          {/* 규칙 */}
          <button
            onClick={onOpenRules}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="게임 규칙 & 점수 안내"
          >
            <HelpCircle size={16} />
          </button>

          {/* 설정 */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="게임 및 플레이어 설정"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

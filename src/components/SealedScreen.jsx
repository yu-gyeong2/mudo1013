import React, { useState, useEffect } from 'react';
import { ShieldAlert, Unlock, AlertTriangle, Bell, Footprints } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

export default function SealedScreen({
  isActive,
  onDeactivate,
  remainingSeconds,
  currentRoundTitle,
  targetWindow,
  isTimeOver,
  onOpenCheckin,
}) {
  const [unlockCounter, setUnlockCounter] = useState(0);

  useEffect(() => {
    if (isTimeOver && isActive) {
      sound.playAlarm();
      triggerVibration([500, 200, 500, 200, 1000]);
    }
  }, [isTimeOver, isActive]);

  if (!isActive) return null;

  // Format seconds to MM:SS
  const mins = Math.floor(Math.max(0, remainingSeconds) / 60);
  const secs = Math.max(0, remainingSeconds) % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleUnlockClick = () => {
    if (unlockCounter >= 2) {
      setUnlockCounter(0);
      onDeactivate();
    } else {
      setUnlockCounter((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 select-none overflow-hidden touch-none">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between pt-4 border-b border-red-900/40 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
          <span className="font-blackhan tracking-widest text-red-500 text-sm">
            SMARTPHONE SEALED
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          양재천 텔레파시 레이스
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-col items-center justify-center text-center my-auto space-y-6">
        
        {isTimeOver ? (
          /* Time Over / 상봉 시각 달성 */
          <div className="space-y-6 animate-bounce">
            <div className="w-24 h-24 rounded-full bg-red-600 border-4 border-yellow-400 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/50">
              <Bell size={48} className="text-yellow-300 animate-wiggle" />
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-yellow-400 text-black font-black text-xs">
                상봉 시각 도착!
              </span>
              <h2 className="text-3xl font-blackhan text-yellow-400 mt-2 drop-shadow-md">
                타임 오버! 상봉하라!
              </h2>
              <p className="text-sm text-slate-200 mt-2 font-medium">
                지금 눈앞에 있는 멤버들과 무한도전 포즈로 인증샷을 찍으세요!
              </p>
            </div>

            <button
              onClick={() => {
                onDeactivate();
                if (onOpenCheckin) onOpenCheckin();
              }}
              className="py-3 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base shadow-xl transition transform active:scale-95"
            >
              상봉 인증샷 & 결과 기록하기 📸
            </button>
          </div>
        ) : (
          /* Ongoing Search / 이동 중 봉인 화면 */
          <>
            {/* Animated Infinite Challenge Skull or Symbol */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-slate-950 border-4 border-red-600/80 flex items-center justify-center shadow-2xl shadow-red-600/30 animate-pulse-ring">
                <span className="text-5xl font-blackhan text-yellow-400">無</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-black uppercase animate-pulse">
                봉인 모드
              </div>
            </div>

            {/* Title & Phase */}
            <div>
              <span className="text-xs text-yellow-400/90 font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                {currentRoundTitle || '이동 및 탐색 진행 중'}
              </span>
              {targetWindow && (
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  상봉 예정: {targetWindow}
                </div>
              )}
            </div>

            {/* Remaining Countdown Timer */}
            <div className="space-y-1">
              <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white drop-shadow-lg">
                {timeFormatted}
              </div>
              <div className="text-xs text-red-400 font-bold flex items-center justify-center gap-1.5">
                <Footprints size={14} />
                <span>스마트폰을 주머니에 넣고 도보로 이동하세요!</span>
              </div>
            </div>

            {/* Sealed Rules Warning Box */}
            <div className="bg-red-950/40 border border-red-600/40 rounded-2xl p-4 max-w-xs text-left text-xs space-y-1.5 text-slate-300">
              <div className="text-red-400 font-black flex items-center gap-1">
                <AlertTriangle size={14} /> 4대 절대 금지 수칙
              </div>
              <p>🚫 카카오톡 / SMS / 전화 통화 금지</p>
              <p>🚫 지도 앱 / 위치 공유(라이프360) 금지</p>
              <p>🚫 자전거, 킥보드, 대중교통 금지 (오직 도보)</p>
              <p className="text-[11px] text-yellow-400 pt-1">
                💡 시간이 다 되면 자동으로 알람과 진동이 울립니다.
              </p>
            </div>
          </>
        )}

      </div>

      {/* Bottom Emergency Unlock */}
      <div className="flex flex-col items-center space-y-2 pb-4">
        <button
          onClick={handleUnlockClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition active:scale-95"
        >
          <Unlock size={14} />
          {unlockCounter === 0 && '봉인 해제 (연속 3회 터치)'}
          {unlockCounter === 1 && '한 번 더 터치하세요!'}
          {unlockCounter === 2 && '마지막 한 번 더 터치!'}
        </button>
        <span className="text-[10px] text-slate-600">
          주머니 속 오작동 방지를 위해 다중 탭으로 잠금 해제됩니다.
        </span>
      </div>

    </div>
  );
}

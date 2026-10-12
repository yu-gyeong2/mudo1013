import React, { useState } from 'react';
import { Mail, ShieldAlert, Camera, MapPin, Eye, EyeOff, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

export default function ActiveRoundView({
  round,
  roundIndex,
  totalRounds,
  remainingSeconds,
  isOngoing,
  isEnded,
  isBeforeStart,
  onActivateSeal,
  onOpenCheckin,
  hasRecordedResult,
  recordedMembersCount,
  onNextRoundManual,
  onPrevRoundManual,
}) {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);

  const handleOpenEnvelope = () => {
    sound.playReveal();
    setEnvelopeOpened(true);
  };

  // Remaining time formatted
  const mins = Math.floor(Math.max(0, remainingSeconds) / 60);
  const secs = Math.max(0, remainingSeconds) % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      
      {/* Round Header & Navigation */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-yellow-500/30 rounded-2xl p-3.5 shadow-md">
        <button
          onClick={onPrevRoundManual}
          disabled={roundIndex <= 0}
          className="text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none px-2 py-1 rounded"
        >
          ◀ 이전 라운드
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black uppercase text-yellow-400 tracking-wider">
            ROUND {roundIndex + 1} / {totalRounds}
          </span>
          <span className="font-blackhan text-white text-sm sm:text-base">
            {round.title}
          </span>
        </div>

        <button
          onClick={onNextRoundManual}
          disabled={roundIndex >= totalRounds - 1}
          className="text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none px-2 py-1 rounded"
        >
          다음 라운드 ▶
        </button>
      </div>

      {/* Countdown Timer Badge Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
          <Clock size={13} className="text-yellow-400" />
          <span>활동 시간: {round.targetWindow}</span>
        </div>

        {/* Big Digital Timer */}
        <div className="my-1">
          <div className={`text-5xl sm:text-6xl font-mono font-black tracking-tight ${
            remainingSeconds <= 60 && isOngoing
              ? 'text-red-500 animate-pulse'
              : 'text-yellow-400'
          }`}>
            {timeFormatted}
          </div>
          <span className="text-[11px] text-slate-400">
            {isBeforeStart && '⏳ 라운드 시작 전 (대기 중)'}
            {isOngoing && '🏃 이동 및 텔레파시 탐색 진행 중!'}
            {isEnded && '🏁 라운드 종료! 상봉 인증 시각입니다'}
          </span>
        </div>

        {/* Sealed Mode Quick Trigger */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={onActivateSeal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition transform active:scale-95"
          >
            <ShieldAlert size={16} />
            <span>핸드폰 봉인하기 (주머니 모드)</span>
          </button>
        </div>
      </div>

      {/* Mission Envelope or Opened Card */}
      {!envelopeOpened ? (
        /* Envelope Unopened State */
        <div
          onClick={handleOpenEnvelope}
          className="cursor-pointer group relative bg-gradient-to-b from-amber-800/40 via-amber-900/20 to-slate-900 border-2 border-yellow-500/60 rounded-3xl p-8 text-center shadow-2xl transition hover:border-yellow-400 hover:scale-[1.01]"
        >
          <div className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition">
            <Mail size={40} className="text-black" />
          </div>
          <div className="mt-4">
            <span className="text-xs bg-yellow-400 text-black font-black px-2.5 py-0.5 rounded-full uppercase">
              CONFIDENTIAL MISSION
            </span>
            <h3 className="text-2xl font-blackhan text-white mt-2">
              제 {roundIndex + 1} 라운드 미션 봉투
            </h3>
            <p className="text-xs text-yellow-300/80 mt-1">
              터치하여 봉투를 열고 텔레파시 힌트를 확인하세요! ✉️
            </p>
          </div>
        </div>
      ) : (
        /* Opened Mission Card */
        <div className="bg-slate-900 border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-fadeIn">
          
          {/* Top Stamp Tag */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-blackhan text-yellow-400 flex items-center gap-1.5">
              <Sparkles size={14} /> 무한도전 텔레파시 지령서
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ROUND 0{roundIndex + 1}
            </span>
          </div>

          {/* Authentic Dramatic Clue Presentation */}
          <div className="py-4 text-center space-y-3">
            <span className="text-xs text-slate-400 font-semibold">
              텔레파시 힌트
            </span>
            <div className="bg-black/60 border border-yellow-500/40 rounded-2xl p-5 shadow-inner">
              <p className="font-dohyeon text-xl sm:text-2xl text-yellow-300 leading-relaxed tracking-wide muhan-caption-yellow">
                "{round.clue}"
              </p>
            </div>
            <p className="text-xs text-slate-300 px-2 leading-relaxed">
              {round.missionDetail}
            </p>
          </div>

          {/* Candidate Spots Dropdown/Toggle */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowCandidates(!showCandidates)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-yellow-400 py-1 font-semibold"
            >
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-yellow-400" />
                후보 스팟 (생각이 안 날 때 힌트 보기)
              </span>
              {showCandidates ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            {showCandidates && (
              <div className="mt-2.5 grid grid-cols-1 gap-2 animate-fadeIn">
                {round.candidateSpots.map((spot, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-[10px] font-bold">
                      {sIdx + 1}
                    </span>
                    <span>{spot}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Rendezvous & Check-in Action Bar */}
      <div className="bg-slate-900/90 border border-yellow-500/30 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="font-bold text-sm text-white flex items-center gap-1.5">
            <Camera size={16} className="text-yellow-400" />
            <span>상봉 결과 & 인증샷 등록</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {hasRecordedResult
              ? `등록 완료: ${recordedMembersCount}명 상봉 성공!`
              : '종료 시각에 만난 멤버들을 체크하고 점수를 획득하세요.'}
          </p>
        </div>

        <button
          onClick={onOpenCheckin}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition shadow-lg ${
            hasRecordedResult
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-500/20'
          }`}
        >
          {hasRecordedResult ? (
            <>
              <CheckCircle2 size={16} />
              <span>결과 수정 / 사진 보기</span>
            </>
          ) : (
            <>
              <Camera size={16} />
              <span>상봉 체크 & 인증샷</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

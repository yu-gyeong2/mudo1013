import React, { useState } from 'react';
import { Trophy, Skull, Users, Sparkles, Copy, Check, RotateCcw, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function FinalSettlement({
  rounds,
  players,
  results, // roundId -> { spot, isAlone, metPlayers, points, photo }
  onResetGame,
  onReopenRound,
}) {
  const [copied, setCopied] = useState(false);

  // Compute stats for all 8 players across all rounds
  const playerStats = players.map((pName) => {
    let totalScore = 0;
    let aloneCount = 0;
    let roundDetails = [];

    rounds.forEach((rnd) => {
      const res = results[rnd.id];
      if (res) {
        if (res.isAlone && res.metPlayers?.includes(pName)) {
          aloneCount += 1;
          roundDetails.push({ roundTitle: rnd.title, points: 0, spot: res.spot, alone: true });
        } else if (res.metPlayers?.includes(pName)) {
          const pts = res.points || res.metPlayers.length * 10;
          totalScore += pts;
          roundDetails.push({ roundTitle: rnd.title, points: pts, spot: res.spot, alone: false });
        } else {
          // not recorded or another group
          roundDetails.push({ roundTitle: rnd.title, points: 0, spot: '미기록', alone: false });
        }
      }
    });

    return {
      name: pName,
      totalScore,
      aloneCount,
      roundDetails,
    };
  });

  // Sort descending by score
  const sortedPlayers = [...playerStats].sort((a, b) => b.totalScore - a.totalScore);

  // Find "Best Duo" (pair that met together most often)
  let bestDuo = null;
  let maxDuoCount = 0;
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const p1 = players[i];
      const p2 = players[j];
      let meetTogetherCount = 0;
      rounds.forEach((rnd) => {
        const res = results[rnd.id];
        if (res && !res.isAlone && res.metPlayers?.includes(p1) && res.metPlayers?.includes(p2)) {
          meetTogetherCount++;
        }
      });
      if (meetTogetherCount > maxDuoCount) {
        maxDuoCount = meetTogetherCount;
        bestDuo = { p1, p2, count: meetTogetherCount };
      }
    }
  }

  // Find "Loneliest Player" (highest aloneCount)
  const loneliest = [...playerStats].sort((a, b) => b.aloneCount - a.aloneCount)[0];

  // Check if all 8 players met in any round
  const hasJackpotRound = rounds.some((rnd) => {
    const res = results[rnd.id];
    return res && !res.isAlone && res.metPlayers?.length >= players.length;
  });

  const handleCelebrate = () => {
    sound.playFanfare();
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
    });
  };

  const handleCopySummary = async () => {
    const text = `🏆 [무한도전 텔레파시 레이스 최종 결산] 🏆\n\n` +
      `🥇 1위: ${sortedPlayers[0]?.name} (${sortedPlayers[0]?.totalScore}점)\n` +
      `🥈 2위: ${sortedPlayers[1]?.name} (${sortedPlayers[1]?.totalScore}점)\n` +
      `🥉 3위: ${sortedPlayers[2]?.name} (${sortedPlayers[2]?.totalScore}점)\n\n` +
      `👑 텔레파시 최강 콤비: ${bestDuo && bestDuo.count > 0 ? `${bestDuo.p1} ❤️ ${bestDuo.p2} (${bestDuo.count}회 상봉)` : '없음'}\n` +
      `💀 외로운 늑대상 (벌칙 당첨): ${loneliest && loneliest.aloneCount > 0 ? `${loneliest.name} (고독 ${loneliest.aloneCount}회)` : '없음'}\n\n` +
      `양재천을 누빈 8명의 도전자 여러분 모두 수고하셨습니다! 무한~도전! 🌟`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-fadeIn pb-12">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-yellow-500/50 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        <span className="bg-yellow-400 text-black font-black text-xs px-3 py-1 rounded-full uppercase">
          AFTERPARTY SETTLEMENT
        </span>
        <h2 className="text-3xl font-blackhan text-white mt-2">
          무한도전 <span className="text-yellow-400">최종 정산 & 시상식</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          양재천 텔레파시 레이스가 종료되었습니다! 뒷풀이 자리에서 영광의 결과를 확인하세요.
        </p>

        {hasJackpotRound && (
          <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-400 rounded-2xl flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400 animate-spin" size={20} />
            <span className="font-black text-yellow-300 text-sm">
              🎉 8인 전원 상봉 기적 달성! 뒷풀이 회비 전액 면제!
            </span>
          </div>
        )}

        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={handleCelebrate}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl shadow-lg transition"
          >
            축하 폭죽 터뜨리기 🎊
          </button>
          <button
            onClick={handleCopySummary}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? '복사 완료!' : '결과 카톡 공유 복사'}
          </button>
        </div>
      </div>

      {/* Special Awards Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 텔레파시 듀오 상 */}
        <div className="bg-slate-900 border border-yellow-500/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400 flex items-center justify-center shrink-0">
            <Trophy className="text-yellow-400" size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-yellow-400 uppercase">
              텔레파시 최강 콤비
            </span>
            <div className="font-black text-sm text-white mt-0.5">
              {bestDuo && bestDuo.count > 0 ? (
                <span>{bestDuo.p1} &amp; {bestDuo.p2}</span>
              ) : (
                <span className="text-slate-400">상봉 데이터 분석 중</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {bestDuo && bestDuo.count > 0 ? `총 ${bestDuo.count}회 같은 장소 상봉 성공!` : '라운드 결과를 기록하세요'}
            </p>
          </div>
        </div>

        {/* 외로운 늑대상 */}
        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center shrink-0">
            <Skull className="text-rose-400" size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-400 uppercase">
              외로운 늑대상 (벌칙 당첨)
            </span>
            <div className="font-black text-sm text-white mt-0.5">
              {loneliest && loneliest.aloneCount > 0 ? (
                <span>{loneliest.name}</span>
              ) : (
                <span className="text-slate-400">고독러 없음</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {loneliest && loneliest.aloneCount > 0 ? `외로움의 벌칙 ${loneliest.aloneCount}회 획득 💀` : '모두가 사이좋게 상봉'}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-blackhan text-base text-white flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" />
            <span>8인 최종 점수 랭킹보드</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            상봉 인원 × 10점 누적
          </span>
        </div>

        <div className="space-y-2">
          {sortedPlayers.map((player, idx) => {
            let rankBadge = `${idx + 1}위`;
            let rankClass = 'bg-slate-800 text-slate-300';
            if (idx === 0) {
              rankBadge = '🥇 1위';
              rankClass = 'bg-yellow-400 text-black font-black';
            } else if (idx === 1) {
              rankBadge = '🥈 2위';
              rankClass = 'bg-slate-300 text-black font-black';
            } else if (idx === 2) {
              rankBadge = '🥉 3위';
              rankClass = 'bg-amber-700 text-white font-black';
            }

            return (
              <div
                key={player.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-750 transition hover:bg-slate-750"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-lg ${rankClass}`}>
                    {rankBadge}
                  </span>
                  <div>
                    <span className="font-bold text-white text-sm">{player.name}</span>
                    {player.aloneCount > 0 && (
                      <span className="ml-2 text-[10px] text-rose-400 font-semibold">
                        💀 고독 {player.aloneCount}회
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-blackhan text-yellow-400 text-base">
                    {player.totalScore}점
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo Gallery Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-blackhan text-base text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-yellow-400" />
            <span>상봉 인증샷 갤러리</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            라운드별 증거 사진
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rounds.map((rnd) => {
            const res = results[rnd.id];
            return (
              <div
                key={rnd.id}
                onClick={() => onReopenRound(rnd.id)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video sm:aspect-square flex flex-col justify-end p-3 transition hover:border-yellow-400"
              >
                {res?.photo ? (
                  <img
                    src={res.photo}
                    alt={rnd.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-2xl mb-1">📸</span>
                    <span className="text-xs text-slate-500 font-medium">사진 미등록</span>
                    <span className="text-[10px] text-yellow-500/80 mt-1">터치하여 등록</span>
                  </div>
                )}
                <div className="relative z-10 bg-black/70 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-yellow-400 font-bold truncate">
                    {rnd.title.split(':')[0]}
                  </div>
                  <div className="text-xs text-white font-semibold truncate">
                    {res?.spot || '장소 미등록'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Restart Button */}
      <div className="text-center pt-2">
        <button
          onClick={onResetGame}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
        >
          <RotateCcw size={14} />
          새 게임 시작 (초기화)
        </button>
      </div>

    </div>
  );
}

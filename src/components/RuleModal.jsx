import React from 'react';
import { X, Award, MapPin, Smartphone, ShieldCheck, Flame } from 'lucide-react';
import { GAME_RULES } from '../utils/gameData';

export default function RuleModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border-2 border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-yellow-500/20 via-slate-800 to-slate-900 border-b border-yellow-500/30">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-sm">無</span>
            <h2 className="text-lg font-blackhan tracking-wide text-white">
              무한도전 텔레파시 <span className="text-yellow-400">게임 규칙서</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm leading-relaxed">
          
          {/* 하이라이트 공지 */}
          <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
            <Flame className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-300 text-sm">진행자가 없어도 8명 전원 플레이어!</p>
              <p className="text-xs text-slate-300 mt-1">
                시간 자동 알람과 화면 봉인 시스템을 통해 8명 모두가 공평하게 힌트를 확인하고 양재천을 누비는 텔레파시 레이스입니다.
              </p>
            </div>
          </div>

          {/* 철칙 4가지 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} /> 4대 절대 수칙 (위반 시 뒷풀이 밥값 독박)
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {GAME_RULES.ironRules.map((rule, idx) => (
                <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="font-bold text-slate-200 text-sm">{rule.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{rule.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 상봉 및 점수 계산 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1.5">
              <Award size={14} /> 상봉 인정 & 점수표
            </h3>
            <div className="space-y-2">
              {GAME_RULES.scoreRules.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div>
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <span className="font-blackhan text-yellow-400 text-base shrink-0 ml-3">{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 양재천 레이스 타임라인 요약 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1.5">
              <MapPin size={14} /> 양재천 레이스 표준 타임테이블
            </h3>
            <div className="relative pl-4 border-l-2 border-yellow-500/30 space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-yellow-300">0단계 (14:00)</span>
                <p className="text-slate-300">양재천 영동2교 하부 집결, 핸드폰 봉인 및 규칙 확정</p>
              </div>
              <div>
                <span className="font-bold text-yellow-300">1라운드 (14:15 ~ 14:45)</span>
                <p className="text-slate-300">"양재천의 첫인상" (가장 탁 트이고 넓은 곳 탐색 후 14:45 상봉)</p>
              </div>
              <div>
                <span className="font-bold text-yellow-300">2라운드 (15:00 ~ 15:30)</span>
                <p className="text-slate-300">"감성 텔레파시" (가장 낭만적이고 감성적인 산책길에서 15:30 상봉)</p>
              </div>
              <div>
                <span className="font-bold text-yellow-300">3라운드 (15:45 ~ 16:15)</span>
                <p className="text-slate-300">"최후의 상봉" (처음 만난 곳 vs 물 건너는 곳! 16:15 상봉)</p>
              </div>
              <div>
                <span className="font-bold text-emerald-400">뒷풀이 & 정산 (16:30~)</span>
                <p className="text-slate-300">카페/식당에 모여 각자 찍은 사진 공개, 점수 합산 및 시상식!</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-wide transition shadow-lg shadow-yellow-500/20"
          >
            확인했습니다! 무한~도전!
          </button>
        </div>

      </div>
    </div>
  );
}

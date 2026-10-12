import React, { useState } from 'react';
import { X, Clock, Users, MapPin, Sparkles, RotateCcw, Check, Plus, Trash2 } from 'lucide-react';
import { YANGJAE_PRESET, OTHER_PRESETS, DEFAULT_PLAYERS } from '../utils/gameData';

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  myPlayer,
  onSelectMyPlayer,
  onResetGame,
}) {
  const [localPlayers, setLocalPlayers] = useState(config.players || DEFAULT_PLAYERS);
  const [localLocation, setLocalLocation] = useState(config.baseLocation || '양재천 영동2교 하부');
  const [localRounds, setLocalRounds] = useState(config.rounds);
  const [activeTab, setActiveTab] = useState('time'); // 'time' | 'players' | 'rounds' | 'preset'
  const [demoMode, setDemoMode] = useState(false);

  if (!isOpen) return null;

  // Format current start time to HH:MM
  const startDate = new Date(config.startTimeMs);
  const currentHH = String(startDate.getHours()).padStart(2, '0');
  const currentMM = String(startDate.getMinutes()).padStart(2, '0');
  const [timeInput, setTimeInput] = useState(`${currentHH}:${currentMM}`);

  const handlePlayerChange = (idx, val) => {
    const updated = [...localPlayers];
    updated[idx] = val;
    setLocalPlayers(updated);
  };

  const handleApplyPreset = (preset) => {
    setLocalLocation(preset.baseLocation);
    setLocalRounds(preset.rounds);
  };

  const handleQuickStartInMinutes = (mins) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + mins);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setTimeInput(`${hh}:${mm}`);
  };

  const handleSave = () => {
    // Parse timeInput into today's timestamp
    const [hh, mm] = timeInput.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hh || 14, mm || 0, 0, 0);

    let updatedRounds = localRounds;
    if (demoMode) {
      // Demo mode: Round 1 starts at 0 min (duration 1 min), Round 2 at 1.5 min (1 min), Round 3 at 3 min (1 min)
      updatedRounds = localRounds.map((r, i) => ({
        ...r,
        startOffsetMin: i * 1.5,
        durationMin: 1,
      }));
    }

    onSaveConfig({
      ...config,
      startTimeMs: newDate.getTime(),
      players: localPlayers.map((p, i) => p.trim() || `멤버${i + 1}`),
      baseLocation: localLocation,
      rounds: updatedRounds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[88vh] bg-slate-900 border-2 border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-yellow-500/30">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xs">無</span>
            <h2 className="text-base font-blackhan tracking-wide text-white">
              게임 <span className="text-yellow-400">환경 설정</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-3">
          <button
            onClick={() => setActiveTab('time')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'time'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            시작 시각 & 모드
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'players'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            8인 멤버 설정
          </button>
          <button
            onClick={() => setActiveTab('rounds')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'rounds'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            라운드/힌트 편집
          </button>
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'preset'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            프리셋 변경
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: Time & Demo Mode */}
          {activeTab === 'time' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  집결 장소
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                  <MapPin size={16} className="text-yellow-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                    className="bg-transparent text-white font-medium w-full focus:outline-none"
                    placeholder="예: 양재천 영동2교 하부"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  0단계 집결 시작 시각 (오늘 기준)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-blackhan text-lg focus:outline-none focus:border-yellow-400"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTimeInput('14:00')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px]"
                    >
                      14:00 (기본)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStartInMinutes(5)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-400 font-semibold text-[11px]"
                    >
                      5분 뒤
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStartInMinutes(0)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-[11px]"
                    >
                      지금 즉시
                    </button>
                  </div>
                </div>
              </div>

              {/* Demo Mode Toggle */}
              <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                      <Sparkles size={14} /> 초고속 데모 모드 (테스트용)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      라운드당 30분 대신 1분 단위로 초고속 시뮬레이션할 수 있습니다.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                    className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Players */}
          {activeTab === 'players' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-bold">
                  8인 플레이어 이름 (클릭하여 내 이름 선택)
                </label>
                <span className="text-[11px] text-yellow-400">
                  내가 플레이할 캐릭터: {myPlayer || '미선택'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {localPlayers.map((name, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                      myPlayer === name
                        ? 'bg-yellow-500/20 border-yellow-400'
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectMyPlayer(name)}
                      className={`w-6 h-6 rounded-full text-[10px] font-black shrink-0 flex items-center justify-center ${
                        myPlayer === name
                          ? 'bg-yellow-400 text-black'
                          : 'bg-slate-700 text-slate-300 hover:bg-yellow-400 hover:text-black'
                      }`}
                      title="이 멤버로 플레이"
                    >
                      {idx + 1}
                    </button>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handlePlayerChange(idx, e.target.value)}
                      className="bg-transparent text-white font-medium w-full focus:outline-none text-xs"
                      placeholder={`멤버 ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                번호 동그라미를 누르면 해당 멤버가 내 스마트폰의 플레이어로 지정됩니다.
              </p>
            </div>
          )}

          {/* TAB 3: Rounds / Hints Edit */}
          {activeTab === 'rounds' && (
            <div className="space-y-4">
              {localRounds.map((rnd, rIdx) => (
                <div key={rnd.id} className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-yellow-400 text-xs">
                      {rnd.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {rnd.durationMin}분 이동
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">미션 힌트</label>
                    <textarea
                      rows={2}
                      value={rnd.clue}
                      onChange={(e) => {
                        const updated = [...localRounds];
                        updated[rIdx].clue = e.target.value;
                        setLocalRounds(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">후보 스팟 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={rnd.candidateSpots.join(', ')}
                      onChange={(e) => {
                        const updated = [...localRounds];
                        updated[rIdx].candidateSpots = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setLocalRounds(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-slate-300">
                다른 테마 코스를 적용할 수 있습니다. (선택 시 힌트와 장소가 자동 변경됩니다)
              </p>
              
              {/* Yangjaecheon Default */}
              <div
                onClick={() => handleApplyPreset(YANGJAE_PRESET)}
                className="p-3 bg-slate-800 hover:bg-slate-700/80 border border-yellow-500/40 rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-yellow-400">{YANGJAE_PRESET.name}</div>
                  <div className="text-[11px] text-slate-400">{YANGJAE_PRESET.baseLocation} (3라운드 코스)</div>
                </div>
                <button className="px-2.5 py-1 rounded bg-yellow-400 text-black font-bold text-xs">
                  적용
                </button>
              </div>

              {/* Other Presets */}
              {OTHER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{preset.name}</div>
                    <div className="text-[11px] text-slate-400">{preset.baseLocation} (3라운드 코스)</div>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-slate-700 hover:bg-yellow-400 hover:text-black text-slate-200 font-bold text-xs transition">
                    적용
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onResetGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-semibold border border-rose-900/40 transition"
          >
            <RotateCcw size={14} />
            전체 초기화
          </button>

          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-wide transition shadow-lg shadow-yellow-500/20"
          >
            설정 저장 및 동기화 적용
          </button>
        </div>

      </div>
    </div>
  );
}

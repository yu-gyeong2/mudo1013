import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TimelineBar from './components/TimelineBar';
import ActiveRoundView from './components/ActiveRoundView';
import SealedScreen from './components/SealedScreen';
import RoundCheckinModal from './components/RoundCheckinModal';
import FinalSettlement from './components/FinalSettlement';
import RuleModal from './components/RuleModal';
import ShareModal from './components/ShareModal';
import SettingsModal from './components/SettingsModal';

import { YANGJAE_PRESET, DEFAULT_PLAYERS } from './utils/gameData';
import { decodeGameConfig } from './utils/share';
import {
  saveGameConfig,
  loadGameConfig,
  saveResults,
  loadResults,
  saveMyPlayer,
  loadMyPlayer,
  saveSoundMuted,
  loadSoundMuted,
  clearAllGameData,
} from './utils/storage';
import { sound, triggerVibration } from './utils/audio';

export default function App() {
  // 1. Initial Config load (URL Hash -> LocalStorage -> Default)
  const initialConfig = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#room=')) {
      const hashData = window.location.hash.replace('#room=', '');
      const decoded = decodeGameConfig(hashData);
      if (decoded) {
        saveGameConfig(decoded);
        return decoded;
      }
    }

    const saved = loadGameConfig();
    if (saved) return saved;

    // Default configuration for today at 14:00
    const today = new Date();
    today.setHours(14, 0, 0, 0);

    return {
      presetId: YANGJAE_PRESET.id,
      baseLocation: YANGJAE_PRESET.baseLocation,
      startTimeMs: today.getTime(),
      players: DEFAULT_PLAYERS,
      rounds: YANGJAE_PRESET.rounds,
    };
  }, []);

  const [config, setConfig] = useState(initialConfig);
  const [results, setResults] = useState(() => loadResults());
  const [myPlayer, setMyPlayer] = useState(() => loadMyPlayer() || DEFAULT_PLAYERS[0]);
  const [isMuted, setIsMuted] = useState(() => loadSoundMuted());

  // View & Modal states
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isSettlementActive, setIsSettlementActive] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  // Real-time clock state
  const [nowMs, setNowMs] = useState(Date.now());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync mute state with sound manager
  useEffect(() => {
    sound.setMuted(isMuted);
    saveSoundMuted(isMuted);
  }, [isMuted]);

  // Current active round object
  const currentRound = config.rounds[currentRoundIndex] || config.rounds[0];

  // Timing calculations for current round
  const roundStartTimeMs = config.startTimeMs + (currentRound.startOffsetMin || 0) * 60000;
  const roundEndTimeMs = roundStartTimeMs + (currentRound.durationMin || 30) * 60000;

  const isBeforeStart = nowMs < roundStartTimeMs;
  const isOngoing = nowMs >= roundStartTimeMs && nowMs < roundEndTimeMs;
  const isEnded = nowMs >= roundEndTimeMs;

  // Remaining seconds
  const remainingSeconds = useMemo(() => {
    if (isBeforeStart) {
      return Math.max(0, Math.floor((roundStartTimeMs - nowMs) / 1000));
    }
    return Math.max(0, Math.floor((roundEndTimeMs - nowMs) / 1000));
  }, [isBeforeStart, roundStartTimeMs, roundEndTimeMs, nowMs]);

  // Trigger alarm when timer hits 0
  useEffect(() => {
    if (isOngoing && remainingSeconds === 0) {
      sound.playAlarm();
      triggerVibration([500, 200, 500, 200, 1000]);
    }
  }, [remainingSeconds, isOngoing]);

  // Handlers
  const handleToggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    saveGameConfig(newConfig);
  };

  const handleSelectMyPlayer = (name) => {
    setMyPlayer(name);
    saveMyPlayer(name);
  };

  const handleSaveResult = (roundId, resultData) => {
    const updated = {
      ...results,
      [roundId]: resultData,
    };
    setResults(updated);
    saveResults(updated);
  };

  const handleResetGame = () => {
    if (window.confirm('게임 진행 내역을 모두 초기화하고 새 게임을 시작하시겠습니까?')) {
      clearAllGameData();
      const today = new Date();
      today.setHours(14, 0, 0, 0);

      const resetConfig = {
        presetId: YANGJAE_PRESET.id,
        baseLocation: YANGJAE_PRESET.baseLocation,
        startTimeMs: today.getTime(),
        players: DEFAULT_PLAYERS,
        rounds: YANGJAE_PRESET.rounds,
      };
      setConfig(resetConfig);
      setResults({});
      setIsSettlementActive(false);
      setCurrentRoundIndex(0);
      setIsSealed(false);
      window.location.hash = '';
    }
  };

  return (
    <div
      onClick={() => sound.init()}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none"
    >
      {/* Header */}
      <Header
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRuleOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onActivateSeal={() => setIsSealed(true)}
        isSealed={isSealed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 space-y-4">
        
        {/* Progress Bar / Stage Stepper */}
        <TimelineBar
          rounds={config.rounds}
          currentRoundIndex={currentRoundIndex}
          onSelectRound={(idx) => {
            setCurrentRoundIndex(idx);
            setIsSettlementActive(false);
          }}
          isSettlementActive={isSettlementActive}
          onSelectSettlement={() => setIsSettlementActive(true)}
          results={results}
        />

        {/* View Switch: Active Round or Final Settlement */}
        {isSettlementActive ? (
          <FinalSettlement
            rounds={config.rounds}
            players={config.players}
            results={results}
            onResetGame={handleResetGame}
            onReopenRound={(rndId) => {
              const idx = config.rounds.findIndex((r) => r.id === rndId);
              if (idx !== -1) {
                setCurrentRoundIndex(idx);
                setIsSettlementActive(false);
                setIsCheckinOpen(true);
              }
            }}
          />
        ) : (
          <ActiveRoundView
            round={currentRound}
            roundIndex={currentRoundIndex}
            totalRounds={config.rounds.length}
            remainingSeconds={remainingSeconds}
            isOngoing={isOngoing}
            isEnded={isEnded}
            isBeforeStart={isBeforeStart}
            onActivateSeal={() => setIsSealed(true)}
            onOpenCheckin={() => setIsCheckinOpen(true)}
            hasRecordedResult={Boolean(results[currentRound.id])}
            recordedMembersCount={results[currentRound.id]?.metPlayers?.length || 0}
            onNextRoundManual={() => {
              if (currentRoundIndex < config.rounds.length - 1) {
                setCurrentRoundIndex(currentRoundIndex + 1);
              } else {
                setIsSettlementActive(true);
              }
            }}
            onPrevRoundManual={() => {
              if (currentRoundIndex > 0) {
                setCurrentRoundIndex(currentRoundIndex - 1);
              }
            }}
          />
        )}
      </main>

      {/* Floating Bottom Quick Seal Bar on Mobile */}
      {!isSealed && !isSettlementActive && (
        <div className="sticky bottom-3 px-4 max-w-xl mx-auto w-full z-20 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-red-500/40 rounded-2xl p-2.5 flex items-center justify-between shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div className="text-xs">
                <span className="text-slate-400 font-mono">내 캐릭터:</span>{' '}
                <strong className="text-yellow-400 font-bold">{myPlayer}</strong>
              </div>
            </div>

            <button
              onClick={() => setIsSealed(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow transition active:scale-95"
            >
              🔒 지금 핸드폰 봉인
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Pocket Sealed Mode */}
      <SealedScreen
        isActive={isSealed}
        onDeactivate={() => setIsSealed(false)}
        remainingSeconds={remainingSeconds}
        currentRoundTitle={currentRound.title}
        targetWindow={currentRound.targetWindow}
        isTimeOver={isEnded}
        onOpenCheckin={() => setIsCheckinOpen(true)}
      />

      {/* Modals */}
      <RuleModal
        isOpen={isRuleOpen}
        onClose={() => setIsRuleOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        config={config}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        myPlayer={myPlayer}
        onSelectMyPlayer={handleSelectMyPlayer}
        onResetGame={handleResetGame}
      />

      <RoundCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        round={currentRound}
        roundIndex={currentRoundIndex}
        players={config.players}
        myPlayer={myPlayer}
        existingResult={results[currentRound.id]}
        onSaveResult={handleSaveResult}
      />
    </div>
  );
}

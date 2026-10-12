import React, { useState } from 'react';
import { X, Camera, Users, Award, Skull, Upload, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { processPhotoWithWatermark } from '../utils/photo';
import confetti from 'canvas-confetti';

export default function RoundCheckinModal({
  isOpen,
  onClose,
  round,
  roundIndex,
  players,
  myPlayer,
  existingResult,
  onSaveResult,
}) {
  const [selectedSpot, setSelectedSpot] = useState(
    existingResult?.spot || round.candidateSpots[0] || '영동2교 하부'
  );
  const [customSpot, setCustomSpot] = useState(existingResult?.customSpot || '');
  const [isAlone, setIsAlone] = useState(existingResult?.isAlone || false);
  const [metPlayers, setMetPlayers] = useState(
    existingResult?.metPlayers || (myPlayer ? [myPlayer] : [])
  );
  const [photoDataUrl, setPhotoDataUrl] = useState(existingResult?.photo || null);
  const [processingPhoto, setProcessingPhoto] = useState(false);

  if (!isOpen) return null;

  const togglePlayer = (pName) => {
    if (isAlone) setIsAlone(false);
    if (metPlayers.includes(pName)) {
      setMetPlayers(metPlayers.filter((p) => p !== pName));
    } else {
      setMetPlayers([...metPlayers, pName]);
    }
  };

  const handleAloneToggle = () => {
    if (!isAlone) {
      sound.playSkull();
      setIsAlone(true);
      setMetPlayers(myPlayer ? [myPlayer] : []);
    } else {
      setIsAlone(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessingPhoto(true);
      const spotName = customSpot.trim() || selectedSpot;
      const subtitle = isAlone
        ? `고독한 텔레파시 (혼자 도착) | ${spotName}`
        : `${metPlayers.length}인 상봉 성공! (${spotName})`;

      const watermarked = await processPhotoWithWatermark(
        file,
        `무한도전 ${round.title.split(':')[0]}`,
        subtitle
      );
      setPhotoDataUrl(watermarked);
    } catch (err) {
      console.error('Photo processing failed', err);
    } finally {
      setProcessingPhoto(false);
    }
  };

  // Calculate points
  const points = isAlone ? 0 : metPlayers.length * 10;
  const isJackpot = !isAlone && metPlayers.length === players.length && players.length >= 8;

  const handleSave = () => {
    if (isJackpot) {
      sound.playFanfare();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    } else if (isAlone) {
      sound.playSkull();
    } else {
      sound.playFanfare();
    }

    onSaveResult(round.id, {
      spot: customSpot.trim() || selectedSpot,
      isAlone,
      metPlayers: isAlone ? (myPlayer ? [myPlayer] : []) : metPlayers,
      points,
      photo: photoDataUrl,
      timestamp: Date.now(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border-2 border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-blackhan tracking-wide text-white">
              {round.title.split(':')[0]} <span className="text-yellow-400">상봉 결과 등록</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          
          {/* Step 1: 도착 장소 선택 */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <span>1. 도착한 장소 선택</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {round.candidateSpots.map((spot, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => {
                    setSelectedSpot(spot);
                    setCustomSpot('');
                  }}
                  className={`p-2.5 rounded-xl text-left border transition text-xs font-medium ${
                    selectedSpot === spot && !customSpot
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  📍 {spot}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="직접 입력 (다른 장소에 도착한 경우)"
              value={customSpot}
              onChange={(e) => setCustomSpot(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Step 2: 만난 멤버 선택 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Users size={14} className="text-yellow-400" />
                <span>2. 그 장소에서 마주친 멤버는?</span>
              </label>
              
              {/* 혼자 남음 토글 */}
              <button
                type="button"
                onClick={handleAloneToggle}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                  isAlone
                    ? 'bg-red-950/80 border-red-500 text-red-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Skull size={13} />
                <span>혼자 남음 (0점)</span>
              </button>
            </div>

            {!isAlone ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {players.map((pName) => {
                  const isChecked = metPlayers.includes(pName);
                  const isMe = pName === myPlayer;
                  return (
                    <button
                      key={pName}
                      type="button"
                      onClick={() => togglePlayer(pName)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        isChecked
                          ? 'bg-yellow-400 text-black border-yellow-300 shadow-md font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{pName}</span>
                        {isMe && <span className="text-[9px] bg-black/20 px-1 rounded font-black">나</span>}
                      </div>
                      <span className="text-[10px] opacity-75">
                        {isChecked ? '✓ 상봉' : '+ 선택'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-red-950/30 border border-red-700/50 rounded-2xl text-center space-y-1">
                <p className="text-sm font-bold text-red-400">💀 아무도 만나지 못했습니다...</p>
                <p className="text-[11px] text-slate-400">외로움의 벌칙 (0점). 다음 라운드에서 만회를 노리세요!</p>
              </div>
            )}

            {/* Score Calculator Preview */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs">획득 예상 점수:</span>
                <span className="text-slate-200 text-xs ml-1 font-semibold">
                  {isAlone ? '혼자 남음 (0점)' : `${metPlayers.length}명 × 10점`}
                </span>
              </div>
              <div className="text-lg font-blackhan text-yellow-400">
                +{points}점
              </div>
            </div>
          </div>

          {/* Step 3: 인증샷 등록 (선택) */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Camera size={14} className="text-yellow-400" />
              <span>3. 상봉 인증샷 촬영 / 첨부 (무한도전 자막 자동 합성)</span>
            </label>

            {photoDataUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-lg">
                <img
                  src={photoDataUrl}
                  alt="인증샷"
                  className="w-full max-h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoDataUrl(null)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-700 hover:border-yellow-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-800/40">
                <Upload size={24} className="text-slate-400 mb-1" />
                <span className="text-slate-300 font-semibold text-xs">
                  {processingPhoto ? '자막 합성 처리 중...' : '카메라 촬영 또는 갤러리 사진 선택'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  무한도전 시그니처 엠블럼과 자막이 자동 합성됩니다.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-wide transition shadow-lg shadow-yellow-500/20"
          >
            점수 및 결과 저장
          </button>
        </div>

      </div>
    </div>
  );
}

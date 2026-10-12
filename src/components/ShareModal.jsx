import React, { useState } from 'react';
import { X, Copy, Check, QrCode, MessageSquare, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateShareUrl, formatKakaoMessage } from '../utils/share';

export default function ShareModal({ isOpen, onClose, config }) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const shareUrl = generateShareUrl(config);
  const kakaoMessage = formatKakaoMessage(config, shareUrl);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyKakao = async () => {
    try {
      await navigator.clipboard.writeText(kakaoMessage);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-yellow-500/30">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-blackhan tracking-wide text-white">
              8인 실시간 <span className="text-yellow-400">동기화 공유</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center text-center space-y-4">
          <p className="text-xs text-slate-300">
            현장에서 친구들이 스마트폰 카메라로 아래 QR 코드를 스캔하면 <br />
            <strong className="text-yellow-400 font-bold">1초의 오차 없이 동일한 타이머가 동기화</strong>됩니다!
          </p>

          {/* QR Code Card */}
          <div className="p-3 bg-white rounded-2xl shadow-lg border-4 border-yellow-400 flex items-center justify-center">
            <QRCodeSVG
              value={shareUrl}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>

          <div className="text-[11px] text-slate-400">
            집결 장소: <span className="text-slate-200 font-medium">{config.baseLocation}</span>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-2">
            <button
              onClick={handleCopyKakao}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FEE500] hover:bg-[#ebd300] text-[#191919] font-bold text-xs flex items-center justify-center gap-2 transition shadow"
            >
              <MessageSquare size={16} />
              {copiedMsg ? '카톡 초대 문구 복사 완료! ✨' : '단톡방용 예약/초대 문구 복사'}
            </button>

            <button
              onClick={handleCopyUrl}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copiedUrl ? '링크 복사 완료!' : '동기화 웹 링크 복사'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-slate-950 text-center border-t border-slate-800 text-[11px] text-slate-500">
          💡 한 번 접속하면 야외에서 데이터가 끊겨도 타이머가 정상 작동합니다.
        </div>

      </div>
    </div>
  );
}

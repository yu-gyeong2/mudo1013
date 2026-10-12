// 게임 설정 URL 인코딩 및 공유 유틸리티

export function encodeGameConfig(config) {
  try {
    const compact = {
      p: config.players,
      st: config.startTimeMs,
      pr: config.presetId,
      r: config.rounds.map(r => ({
        id: r.id,
        t: r.title,
        w: r.targetWindow,
        so: r.startOffsetMin,
        d: r.durationMin,
        c: r.clue,
        cs: r.candidateSpots,
        m: r.missionDetail,
      })),
      l: config.baseLocation,
    };
    const jsonStr = JSON.stringify(compact);
    // Base64 safe for URL
    return btoa(encodeURIComponent(jsonStr));
  } catch (err) {
    console.error('Failed to encode game config', err);
    return '';
  }
}

export function decodeGameConfig(encodedStr) {
  try {
    if (!encodedStr) return null;
    const jsonStr = decodeURIComponent(atob(encodedStr));
    const compact = JSON.parse(jsonStr);
    return {
      players: compact.p,
      startTimeMs: compact.st,
      presetId: compact.pr || 'custom',
      baseLocation: compact.l || '양재천 영동2교 하부',
      rounds: compact.r.map(r => ({
        id: r.id,
        title: r.t,
        targetWindow: r.w,
        startOffsetMin: r.so,
        durationMin: r.d,
        clue: r.c,
        candidateSpots: r.cs,
        missionDetail: r.m,
      })),
    };
  } catch (err) {
    console.error('Failed to decode game config', err);
    return null;
  }
}

export function generateShareUrl(config) {
  const encoded = encodeGameConfig(config);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#room=${encoded}`;
}

export function formatKakaoMessage(config, shareUrl) {
  const startDate = new Date(config.startTimeMs);
  const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `🏃♂️ [무한도전 텔레파시 레이스 양재천 편] 🏃♀️\n` +
    `진행자 없는 8인 텔레파시 게임에 초대합니다!\n\n` +
    `📍 집결 장소: ${config.baseLocation}\n` +
    `⏰ 시작 시각: ${timeStr} (정각 집결 & 핸드폰 봉인!)\n` +
    `👥 참가 멤버: ${config.players.join(', ')}\n\n` +
    `🚨 규칙: 연락 일체 금지 / 오직 도보만 허용 / 정각마다 상봉\n\n` +
    `동기화 게임 링크 열기 (타이머 & 미션 자동 발송):\n${shareUrl}`;
}

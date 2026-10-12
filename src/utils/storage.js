// 로컬 스토리지 상태 저장 및 관리

const STORAGE_KEYS = {
  GAME_CONFIG: 'muhan_telepathy_config',
  RESULTS: 'muhan_telepathy_results',
  MY_PLAYER: 'muhan_telepathy_my_player',
  PHOTOS: 'muhan_telepathy_photos',
  SOUND_MUTED: 'muhan_telepathy_muted',
};

export function saveGameConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save game config', err);
  }
}

export function loadGameConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_CONFIG);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveResults(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (err) {
    console.error('Failed to save results', err);
  }
}

export function loadResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMyPlayer(name) {
  try {
    localStorage.setItem(STORAGE_KEYS.MY_PLAYER, name);
  } catch {
    // ignore
  }
}

export function loadMyPlayer() {
  try {
    return localStorage.getItem(STORAGE_KEYS.MY_PLAYER) || '';
  } catch {
    return '';
  }
}

export function savePhotos(photos) {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch {
    // ignore quota errors
  }
}

export function loadPhotos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSoundMuted(muted) {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(muted));
  } catch {
    // ignore
  }
}

export function loadSoundMuted() {
  try {
    return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  } catch {
    return false;
  }
}

export function clearAllGameData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem(STORAGE_KEYS.MY_PLAYER);
  } catch {
    // ignore
  }
}

let audioEnabled = true;

const BASE_URL = import.meta.env.BASE_URL;

export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled;
}

export function playMergeSound() {
  if (!audioEnabled) return;
  const audio = new Audio(`${BASE_URL}merge.wav`);
  audio.volume = 0.5;
  audio.play();
}

export function playGameOverSound() {
  if (!audioEnabled) return;
  const audio = new Audio(`${BASE_URL}game-over.wav`);
  audio.volume = 0.5;
  audio.play();
}
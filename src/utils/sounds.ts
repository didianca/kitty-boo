let audioEnabled = true;

export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled;
}

export function playMergeSound() {
  if (!audioEnabled) return;
  const audio = new Audio("/merge.wav");
  audio.volume = 0.5;
  audio.play();
}

export function playGameOverSound() {
  if (!audioEnabled) return;
  const audio = new Audio("/game-over.wav");
  audio.volume = 0.5;
  audio.play();
}
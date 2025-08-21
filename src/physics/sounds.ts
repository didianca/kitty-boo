export function playMergeSound() {
  const audio = new Audio("./merge.wav"); // leading slash!
  audio.volume = 0.5;
  audio.play();
}

export function playGameOverSound() {
  const audio = new Audio("./game-over.wav"); // leading slash!
  audio.volume = 0.5;
  audio.play();
}
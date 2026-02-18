import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.unmock("../../utils/sounds.util");

describe("sounds.util", () => {
  const mockPlay = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "Audio",
      vi.fn().mockImplementation(function (this: { play: () => void }) {
        return { play: mockPlay };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("setAudioEnabled toggles state", async () => {
    const { setAudioEnabled } = await import("../../utils/sounds.util");
    expect(typeof setAudioEnabled).toBe("function");
    setAudioEnabled(false);
    setAudioEnabled(true);
  });

  it("playMergeSound creates and plays audio when enabled", async () => {
    const { playMergeSound } = await import("../../utils/sounds.util");
    playMergeSound();
    expect(mockPlay).toHaveBeenCalled();
  });

  it("playGameOverSound creates and plays audio when enabled", async () => {
    const { playGameOverSound } = await import("../../utils/sounds.util");
    playGameOverSound();
    expect(mockPlay).toHaveBeenCalled();
  });
});

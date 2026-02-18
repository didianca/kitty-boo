import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { vi, afterEach } from "vitest";

afterEach(cleanup);

// Mock audio
vi.mock("../utils/sounds.util", () => ({
  setAudioEnabled: vi.fn(),
  playMergeSound: vi.fn(),
  playGameOverSound: vi.fn(),
}));

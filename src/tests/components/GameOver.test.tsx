import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameOverPopup } from "../../components/GameOver";

describe("GameOverPopup", () => {
  it("renders Game Over and score", () => {
    render(<GameOverPopup score={100} onReset={() => {}} />);
    expect(screen.getByText(/game over/i)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it("renders Play Again button", () => {
    render(<GameOverPopup score={50} onReset={() => {}} />);
    expect(screen.getByRole("button", { name: /play again/i })).toBeInTheDocument();
  });

  it("calls onReset when Play Again is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<GameOverPopup score={50} onReset={onReset} />);
    await user.click(screen.getByRole("button", { name: /play again/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("shows New Best when score beats previous", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => JSON.stringify([{ score: 50 }])),
      setItem: vi.fn(),
    });
    render(<GameOverPopup score={100} onReset={() => {}} />);
    expect(screen.getByText(/new best/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});

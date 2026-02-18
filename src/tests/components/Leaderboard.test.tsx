import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Leaderboard } from "../../components/Leaderboard";

describe("Leaderboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Leaderboard title", () => {
    render(<Leaderboard />);
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
  });

  it("shows entries from localStorage", () => {
    localStorage.setItem(
      "kitty-boo-leaderboard",
      JSON.stringify([{ score: 200, date: "2024-01-01T12:00:00.000Z" }])
    );
    render(<Leaderboard />);
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("renders empty when no leaderboard", () => {
    render(<Leaderboard />);
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
  });
});

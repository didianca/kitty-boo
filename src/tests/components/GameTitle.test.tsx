import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameTitle } from "../../components/GameTitle";

vi.mock("import.meta", () => ({
  env: { BASE_URL: "/" },
}));

describe("GameTitle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the game title image", () => {
    render(<GameTitle />);
    const img = screen.getByRole("img", { name: /kitty boo/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("game_title.png"));
  });

  it("has game-title class on container", () => {
    const { container } = render(<GameTitle />);
    expect(container.querySelector(".game-title")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaderboardButton } from "../../components/LeaderboardButton";

describe("LeaderboardButton", () => {
  it("renders and is accessible", () => {
    render(<LeaderboardButton onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /show leaderboard/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LeaderboardButton onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

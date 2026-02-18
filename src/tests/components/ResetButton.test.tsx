import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetButton } from "../../components/ResetButton";

describe("ResetButton", () => {
  it("renders Reset text", () => {
    render(<ResetButton onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ResetButton onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

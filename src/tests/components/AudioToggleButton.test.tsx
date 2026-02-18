import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AudioToggleButton } from "../../components/AudioToggleButton";

describe("AudioToggleButton", () => {
  it("renders with mute label when audio is on", () => {
    const setAudioOn = vi.fn();
    render(<AudioToggleButton audioOn={true} setAudioOn={setAudioOn} />);
    expect(screen.getByRole("button", { name: /mute audio/i })).toBeInTheDocument();
  });

  it("renders with unmute label when audio is off", () => {
    const setAudioOn = vi.fn();
    render(<AudioToggleButton audioOn={false} setAudioOn={setAudioOn} />);
    expect(screen.getByRole("button", { name: /unmute audio/i })).toBeInTheDocument();
  });

  it("calls setAudioOn with inverted value when clicked", async () => {
    const user = userEvent.setup();
    const setAudioOn = vi.fn();
    render(<AudioToggleButton audioOn={true} setAudioOn={setAudioOn} />);
    await user.click(screen.getByRole("button"));
    expect(setAudioOn).toHaveBeenCalledWith(false);
  });
});

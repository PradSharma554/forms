import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "../atoms/checkbox";
import { describe, it, expect } from "vitest";

describe("Checkbox", () => {
  it("renders a checkbox input", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("is checked when passed `checked` prop", () => {
    render(<Checkbox checked={true} readOnly />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });
});
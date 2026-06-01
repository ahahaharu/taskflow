import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/shared/Avatar";

describe("Avatar", () => {
  it("renders an image when url is provided", () => {
    render(<Avatar name="Jane Doe" url="https://example.com/a.png" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/a.png");
    expect(img).toHaveAttribute("alt", "Jane Doe");
  });

  it("falls back to initials from the name when no url is given", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows a '?' placeholder when neither url nor name is provided", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});

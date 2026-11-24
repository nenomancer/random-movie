import { describe, expect, it } from "vitest";
import { charsVisible } from "./typewriter";

describe("charsVisible", () => {
  it("starts with nothing visible", () => {
    expect(charsVisible(0, 25, 10)).toBe(0);
  });

  it("reveals one character per interval", () => {
    expect(charsVisible(24, 25, 10)).toBe(0);
    expect(charsVisible(25, 25, 10)).toBe(1);
    expect(charsVisible(130, 25, 10)).toBe(5);
  });

  it("never goes past the end of the text", () => {
    expect(charsVisible(10_000, 25, 10)).toBe(10);
  });

  it("never goes below zero", () => {
    expect(charsVisible(-50, 25, 10)).toBe(0);
  });

  it("shows everything at once when the speed is zero or negative", () => {
    expect(charsVisible(0, 0, 10)).toBe(10);
    expect(charsVisible(0, -5, 10)).toBe(10);
  });

  it("handles an empty message", () => {
    expect(charsVisible(500, 25, 0)).toBe(0);
  });
});

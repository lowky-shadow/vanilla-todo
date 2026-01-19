import { debounce } from "../utils.js";
import { describe, test, expect, vi } from "vitest";

console.log("test file loaded");
describe("debounce", () => {
  test("calls function only once after delay", () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn("a");
    debouncedFn("b");
    debouncedFn("c");

    // Nothing happens immediately
    expect(fn).not.toHaveBeenCalled();

    // Advance time
    vi.advanceTimersByTime(300);

    // Only last call survives
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");

    vi.useRealTimers();
  });
});

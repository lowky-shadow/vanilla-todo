import { retryWithBackoff } from "../retryWithBackoff";
import { describe, test, expect, vi } from "vitest";

describe("retryWithBackoff", () => {
  test("retries until success", async () => {
    vi.useFakeTimers();

    let attempts = 0;
    const fn = vi.fn(() => {
      attempts++;
      return attempts < 3 ? Promise.reject("fail") : Promise.resolve("ok");
    });

    const promise = retryWithBackoff(fn, {
      retries: 3,
      delay: 100,
    });

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  test("fails after max retries", async () => {
    vi.useFakeTimers();

    const fn = vi.fn(() => Promise.reject("fail"));

    const promise = retryWithBackoff(fn, {
      retries: 2,
      delay: 100,
    });

    // Attach rejection handler FIRST
    const assertion = expect(promise).rejects.toBe("fail");

    // Then allow timers to run
    await vi.runAllTimersAsync();

    // Now await the assertion
    await assertion;

    expect(fn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

});

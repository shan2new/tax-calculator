import { act, renderHook } from "@testing-library/react";
import { useViewCycler } from "@/hooks/useViewCycler";
import { VIEW_SWAP_DELAY_MS } from "@/lib/constants";

describe("useViewCycler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("cycles views after the transition delay", () => {
    const { result } = renderHook(() => useViewCycler({ viewCount: 3 }));

    expect(result.current.view).toBe(0);
    expect(result.current.displayView).toBe(0);

    act(() => {
      result.current.cycle();
    });

    expect(result.current.view).toBe(1);
    expect(result.current.visible).toBe(false);
    expect(result.current.displayView).toBe(0);

    act(() => {
      vi.advanceTimersByTime(VIEW_SWAP_DELAY_MS);
    });

    expect(result.current.displayView).toBe(1);
    expect(result.current.visible).toBe(true);
  });

  it("updates immediately when animation is skipped", () => {
    const { result, rerender } = renderHook(
      ({ skipAnimation }) => useViewCycler({ viewCount: 3, skipAnimation }),
      { initialProps: { skipAnimation: false } }
    );

    act(() => {
      result.current.cycle();
    });

    rerender({ skipAnimation: true });

    expect(result.current.displayView).toBe(result.current.view);
    expect(result.current.visible).toBe(true);
  });
});

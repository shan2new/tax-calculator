import { act, renderHook } from "@testing-library/react";
import { useCollapsible } from "@/hooks/useCollapsible";

describe("useCollapsible", () => {
  it("toggles open state", () => {
    const { result } = renderHook(() => useCollapsible());

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toBe(true);
  });
});

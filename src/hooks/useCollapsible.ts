"use client";

import { useCallback, useState } from "react";

export function useCollapsible(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  return {
    open,
    setOpen,
    toggle,
  };
}

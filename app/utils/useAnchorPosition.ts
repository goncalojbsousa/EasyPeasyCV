'use client';

import { useEffect, useState } from 'react';

export function useAnchorPosition(
  anchor: { current: HTMLElement | null },
  open: boolean
) {
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);

  useEffect(() => {
    const update = () => {
      if (!anchor.current) return;
      const r = anchor.current.getBoundingClientRect();
      setPos({ left: r.left, top: r.top, width: r.width });
    };
    if (open) {
      update();
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
    }
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchor, open]);

  return pos;
}

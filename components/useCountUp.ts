import { useEffect, useState } from "react";

/**
 * Animates a number from 0 → target with an ease-out curve while `run` is true.
 * Resets to 0 whenever `run` flips back to false (used for looping mocks).
 */
export function useCountUp(target: number, run: boolean, duration = 1100) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!run) {
      setVal(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);

  return val;
}

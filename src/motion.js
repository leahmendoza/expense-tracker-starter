import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Tweens from the previous value to `target` whenever it changes.
// Starts at the target on mount so the first render shows real numbers.
export function useAnimatedNumber(target, duration = 650) {
  const to = Number(target);
  const [value, setValue] = useState(to);
  const currentRef = useRef(to);
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    const from = currentRef.current;
    if (reduceMotion || from === to) {
      currentRef.current = to;
      return;
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = from + (to - from) * easeOutCubic(progress);
      currentRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, duration, reduceMotion]);

  return reduceMotion ? to : value;
}

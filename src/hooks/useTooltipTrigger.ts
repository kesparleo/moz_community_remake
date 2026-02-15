import { useEffect, useRef, useState } from "react";

export function useTooltipTrigger(
  delay: number,
  duration?: number
) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    let showTimer: number;
    let hideTimer: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();

        showTimer = window.setTimeout(() => {
          setVisible(true);

          if (duration) {
            hideTimer = window.setTimeout(
              () => setVisible(false),
              duration
            );
          }
        }, delay);
      },
      { threshold: 0.25 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, duration]);

  return { ref, visible };
}

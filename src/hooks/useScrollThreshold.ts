import { useEffect, useState } from "react";

export function useScrollThreshold(threshold: number) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsPastThreshold(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // sincronização inicial

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isPastThreshold;
}

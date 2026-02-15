import { useEffect, useState } from "react";

export function useIsTop(offset: number = 10) {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsTop(window.scrollY < offset);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return isTop;
}

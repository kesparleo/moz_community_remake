import { useEffect, useState } from "react";

export function useScrollSpy(offset: number = 120) {
  const [isTop, setIsTop] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsTop(scrollY < 10);

          const scrollPos = scrollY + offset;

          sections.forEach((sec) => {
            if (
              scrollPos >= sec.offsetTop &&
              scrollPos < sec.offsetTop + sec.offsetHeight
            ) {
              setActiveSection(sec.id);
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return { isTop, activeSection };
}

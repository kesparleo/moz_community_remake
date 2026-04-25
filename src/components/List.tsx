import { useEffect, useRef } from "react";
import styles from "../styles/List.module.css";
import SimpleCommunityCard from "./SimplyCommunityCard";
import type { Category } from "../data/types";
import { listaData } from "../data/community";
import { CATEGORY_INFO } from "../data/category";

const TARGET_CATEGORIES: Category[] = ["Coding", "Design", "Data", "Networks", "General"];

const Communities: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isFocused);
          } else {
            entry.target.classList.remove(styles.isFocused);
          }
        });
      },
      { threshold: 0.3 },
    );

    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {TARGET_CATEGORIES.map((category, index) => {
        const items = listaData.filter((item) =>
          item.categories.includes(category),
        );
        const info = CATEGORY_INFO[category];

        if (items.length === 0) return null;

        return (
          <section
            key={category}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[index] = el;
            }}
            className={styles.focusSection}
          >
            <div className={styles.innerContent}>
              <header className={styles.header}>
                <h2 className={styles.title}>{info?.title}</h2>
                <p className={styles.description}>{info?.description}</p>
              </header>

              <div className={styles.grid}>
                {items.map((item) => (
                  <SimpleCommunityCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Communities;

import React, { useState } from "react";
import styles from "../styles/Hero.module.css";
import type { HeroProps } from "../data/types";
import { useIsTop } from "../hooks/useIsTop";
import CommunityModal from "./newCommunity";

const Hero: React.FC<HeroProps> = ({ description }) => {
  const isTop = useIsTop(10);
  const [isModalOpen, setModalOpen] = useState(false);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section id="home" className={`${styles.hero} ${styles.hero__text}`}>
      <div
        className={`${styles.hero__content} ${
          isTop ? styles.visible : styles.hidden
        }`}
      >
        <h1>
          <img src="/mz_logo.png" alt="Logo" className={styles.hero__logo} />
        </h1>
        <p className={styles.hero__description}>{description}</p>
        <div className={styles.scroll__indicator} onClick={scrollToContent}>
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
        </div>
      </div>

      {isModalOpen && <CommunityModal onClose={() => setModalOpen(false)} />}
    </section>
  );
};

export default Hero;

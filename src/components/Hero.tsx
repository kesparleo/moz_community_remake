import React, { useState } from "react";
import styles from "../styles/Hero.module.css";
import type { HeroProps } from "../data/types";
import Tooltip from "./Tooltip";
import { useIsTop } from "../hooks/useIsTop";
import CommunityModal from "./newCommunity";

const Hero: React.FC<HeroProps> = ({
  description,
  buttonText,
  buttonUrl,
}) => {
  const isTop = useIsTop(10);
  const [isModalOpen, setModalOpen] = useState(false);

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
        <div className={styles.hero__buttons}>
          <Tooltip
            text="Clique e encontre a sua comunidade"
            position="down"
            duration={12000}
          >
            <a href={buttonUrl} className={styles.hero__button}>
              {buttonText}
            </a>
          </Tooltip>
          <button onClick={() => setModalOpen(true)}>Nova Comunidade</button>
        </div>
      </div>
      {isModalOpen && (
        <CommunityModal onClose={() => setModalOpen(false)} />
      )}
    </section>
  );
};

export default Hero;

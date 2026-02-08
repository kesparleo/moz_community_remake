import React, { useState, useEffect } from "react";
import styles from "../styles/Hero.module.css";
import type { HeroProps } from "../data/types";
import Tooltip from "./Tooltip";

const Hero: React.FC<HeroProps> = ({
  logo,
  description,
  buttonText,
  buttonUrl,
}) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className={`${styles.hero} ${styles.hero__text}`}>
      <div
        className={`${styles.hero__content} ${
          isTop ? styles.visible : styles.hidden
        }`}
      >
        <h1>
          <img src={logo} alt="" className={styles.hero__logo} />
        </h1>
        <p className={styles.hero__description}>{description}</p>
        <div className={styles.hero__buttons}>
          <Tooltip
            text={"Clique e encontre a sua comunidade"}
            position="down"
            duration={12000}
          >
            <a href={buttonUrl} className={styles.hero__button}>
              {buttonText}
            </a>
          </Tooltip>
        </div>
      </div>
    </section>
  );
};

export default Hero;

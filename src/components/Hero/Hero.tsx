import React, { useState, useEffect } from "react";
import "./Hero.css";
import type { HeroProps } from "../../data/types";
import Tooltip from "../Tooltip/Tooltip";

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
    <section id="home" className="hero hero__text">
      <div className={`hero__content ${isTop ? "visible" : "hidden"}`}>
        <h1>
          <img
            src={logo}
            alt=""
            className={`--hero-logo`}
          />
        </h1>
        <p className="hero__description">{description}</p>
        <div className="hero__buttons">
          <Tooltip text={"Clique e encontre a sua comunidade"} position="down" duration={12000}>
            <a href={buttonUrl} className="hero__button">
              {buttonText}
            </a>
          </Tooltip>
        </div>
      </div>
    </section>
  );
};

export default Hero;

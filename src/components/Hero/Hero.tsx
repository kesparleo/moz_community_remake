import React from "react";
import "./Hero.css";
import type { HeroProps } from "../../data/types";
import Tooltip from "../Tooltip/Tooltip";

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  buttonText,
  buttonUrl,
}) => {
  return (
    <section id="home" className="hero hero__text">
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
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

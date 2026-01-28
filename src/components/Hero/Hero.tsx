import React from 'react';
import './Hero.css';

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

const Hero: React.FC<HeroProps> = ({ title, description, buttonText, buttonUrl }) => {
  return (
    <section id='home' className="hero">
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__description">{description}</p>
        <a href={buttonUrl} className="hero__button">
          {buttonText}
        </a>
      </div>
    </section>
  );
};

export default Hero;

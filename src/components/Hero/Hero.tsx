import React from 'react';
import './Hero.css';
import {FaGithub} from 'react-icons/fa';

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  githubUrl: string;
}

const Hero: React.FC<HeroProps> = ({ title, description, buttonText, buttonUrl, githubUrl }) => {
  return (
    <section id='home' className="hero">
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__description">{description}</p>
        <div className="hero__buttons">
          <a href={buttonUrl} className="hero__button">
            {buttonText}
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hero__github">
            Contribua <FaGithub className="hero__github-icon" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

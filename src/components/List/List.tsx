import React, { type JSX } from "react";
import "./List.css";
import { listaData, type ListaItem } from "../../data/community";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

const iconMap: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  whatsapp: <FaWhatsapp />,
};

const socialOrder = [
  "instagram",
  "linkedin",
  "facebook",
  "twitter",
  "whatsapp",
];

const Communities: React.FC = () => {
  return (
    <section id="communities" className="lista">
      <header className="lista__header">
        <h2 className="lista__heading">
          <span className="destaque">Veja</span>{" "}
          <span className="secundario">Abaixo</span>
        </h2>
        <p className="lista__intro">
          Lista de Comunidades de Tecnologia e Programação em Moçambique
        </p>
      </header>
      {listaData.map((item: ListaItem, index: number) => (
        <div key={index} className="lista__item">
          <img
            src={
              item.logo ||
              "https://mozcomunidades.web.app/images/comunities/logo.png"
            }
            alt={item.title}
            className="list__logo"
          />
          <div className="lista__content">
            <h3 className="lista__title">{item.title}</h3>
            <p className="lista__description">{item.description}</p>
            <span className="lista__link">
              <FaLink />{" "}
              {item.website ? (
                <a
                  className="lista__website"
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.website.replace(/^(https?:\/\/)?(www\.)?/, "")}
                </a>
              ) : (
                <span className="lista__no-website">sem site</span>
              )}
            </span>
            <div className="lista__social">
              {socialOrder.map((key) =>
                item.social[key] && iconMap[key] ? (
                  <a
                    key={key}
                    href={item.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`lista__social-icon lista__social-${key}`}
                    style={
                      { "--hover-color": item.color } as React.CSSProperties
                    }
                  >
                    {iconMap[key]}
                  </a>
                ) : null,
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Communities;

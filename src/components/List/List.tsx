import React, { useState, type JSX } from "react";
import "./List.css";
import { listaData, type Category, type ListaItem } from "../../data/community";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaLink,
  FaGithub,
  FaTelegram,
  FaYoutube,
  FaCode,
  FaBrain,
  FaDatabase,
  FaNetworkWired,
} from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";
import CategorySelector from "../CategorySelector/CategorySelector";

const iconMap: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  whatsapp: <FaWhatsapp />,
  github: <FaGithub />,
  telegram: <FaTelegram />,
  youtube: <FaYoutube />
};

export const categoryIconMap: Record<Category, JSX.Element> = {
  "Coding": <FaCode />,
  "Artificial Intelligence": <FaBrain />,
  "Data": <FaDatabase />,
  "Networks": <FaNetworkWired />
};

const socialOrder = [
  "instagram",
  "linkedin",
  "facebook",
  "twitter",
  "whatsapp",
  'github',
  'telegram',
  'youtube'
];

const Communities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");

  const allCategories = Array.from(
    new Set(listaData.flatMap(item => item.categories))
  );

  const filteredData = listaData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });


  return (
    <section id="communities" className="list">
      <header className="list__header">
        <h2 className="list__heading">
          <span className="destaque">Veja</span>{" "}
          <span className="secundario">Abaixo</span>
        </h2>
        <p className="list__intro">
          Lista de Comunidades de Tecnologia e Programação em Moçambique
        </p>
        <div className="list__actions">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CategorySelector
            categories={allCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </header>
      {filteredData.map((item: ListaItem, index: number) => (
        <div key={index} className="list__item">
          <img
            src={
              item.logo ||
              "https://mozcomunidades.web.app/images/comunities/logo.png"
            }
            alt={item.title}
            className="list__logo"
          />
          <div className="list__content">
            <h3 className="list__title">{item.title}</h3>
            <div className="list__categories">
              {item.categories.map((cat) => (
                <span key={cat} className="list__category">
                  {cat}
                </span>
              ))}
            </div>
            <p className="list__description">{item.description}</p>
            <span className="list__link">
              <FaLink />{" "}
              {item.website ? (
                <a
                  className="list__website"
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.website.replace(/^(https?:\/\/)?(www\.)?/, "")}
                </a>
              ) : (
                <span className="list__no-website">sem site</span>
              )}
            </span>
            <div className="list__social">
              {socialOrder.map((key) =>
                item.social[key] && iconMap[key] ? (
                  <a
                    key={key}
                    href={item.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`list__social-icon list__social-${key}`}
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
      {filteredData.length === 0 && (
        <p className="list__no-results">Nenhuma comunidade encontrada.</p>
      )}
    </section>
  );
};

export default Communities;

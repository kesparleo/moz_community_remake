import React, { useState, useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import "./List.css";
import { listaData } from "../../data/community";
import { type Category, type ListaItem } from "../../data/types";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaGithub,
  FaTelegram,
  FaYoutube,
  FaCode,
  FaBrain,
  FaDatabase,
  FaNetworkWired,
  FaShieldAlt,
  FaPalette,
  FaTh,
  FaList,
  FaUserSecret,
  FaCloud,
  FaCogs,
} from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";
import CategorySelector from "../CategorySelector/CategorySelector";
import Events from "../Events/EventCard";
import Tooltip from "../Tooltip/Tooltip";

const iconMap: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  whatsapp: <FaWhatsapp />,
  github: <FaGithub />,
  telegram: <FaTelegram />,
  youtube: <FaYoutube />,
};

const categoryIconMap: Record<Category, JSX.Element> = {
  Coding: <FaCode />,
  "Artificial Intelligence": <FaBrain />,
  Data: <FaDatabase />,
  Networks: <FaNetworkWired />,
  Cybersecurity: <FaShieldAlt />,
  Design: <FaPalette />,
  Hacking: <FaUserSecret />,
  Cloud: <FaCloud />,
  Infrastructure: <FaCogs />,
};

const socialOrder = [
  "instagram",
  "linkedin",
  "facebook",
  "twitter",
  "whatsapp",
  "github",
  "telegram",
  "youtube",
];

const Communities: React.FC = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1023);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allCategories = Array.from(
    new Set(listaData.flatMap((item) => item.categories)),
  );

  const [shuffledData, setShuffledData] = useState<ListaItem[]>([]);

  useEffect(() => {
    const shuffled = [...listaData];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledData(shuffled);
  }, []);

  const filteredData = shuffledData.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="communities" className="list list__background">
      <header className="list__header">
        <h2 className="list__heading">
          <span className="destaque">Veja</span>{" "}
          <span className="secundario">Abaixo</span>
        </h2>
        <p className="list__intro">
          Lista de Comunidades de Tecnologia e Programação em Moçambique
        </p>
        <div className="list__actions">
          <Tooltip text="Pesquise por nome" position="left" duration={4000}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Tooltip>
          <Tooltip text="Busque por categoria" duration={6000} delay={5000}>
            <CategorySelector
              categories={allCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Tooltip>
          <Tooltip text="Lista / Grelha, apenas clique" position="down" delay={7000} duration={4000}>
            <button
              onClick={() => setView(view === "grid" ? "list" : "grid")}
              className="button__format"
            >
              {view === "grid" ? <FaList /> : <FaTh />}
            </button>
          </Tooltip>
        </div>
      </header>

      <div
        className={`list__items-container ${view === "grid" ? "grid-view" : "list-view"}`}
      >
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

            {view === "list" ? (
              <div className="list__content">
                <div className="list__title">
                  {item.title}
                </div>

                <div className="list__categories">
                  {item.categories.map((cat) => (
                    <span key={cat} className="list__category">
                      {categoryIconMap[cat as Category]}
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="list__row">
                  <p className="list__description">{item.description}</p>
                  <Link
                    className="list__more"
                    to={`/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Saber mais
                  </Link>
                </div>

                {isMobile && (
                  <div className="events">
                    <Events communityNames={[item.title]} />
                  </div>
                )}

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

                <div className="list__contact">
                  {item.mail && (
                    <a
                      href={`mailto:${item.mail}`}
                      className="list__contact-button"
                    >
                      Contactar
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <Link
                className="list__title"
                to={`/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.title}
              </Link>
            )}

            {!isMobile && view === "list" && (
              <div className="events">
                <Events communityNames={[item.title]} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className="list__no-results">Nenhuma comunidade encontrada.</p>
      )}
    </section>
  );
};

export default Communities;

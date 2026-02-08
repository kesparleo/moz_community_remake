import React, { useState, useEffect, type JSX } from "react";
import Link from "next/link";
import styles from "../styles/List.module.css";
import { listaData } from "../data/community";
import { type Category, type ListaItem } from "../data/types";
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
import SearchBar from "./SearchBar";
import CategorySelector from "./CategorySelector";
import Events from "./EventCard";
import Tooltip from "./Tooltip";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  const updateIsMobile = () => setIsMobile(window.innerWidth <= 1023);
  updateIsMobile(); // define valor inicial no client

  window.addEventListener("resize", updateIsMobile);
  return () => window.removeEventListener("resize", updateIsMobile);
}, []);


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
    <section id="communities" className={`${styles.list} ${styles.list__background}`}>
      <header className={styles.list__header}>
        <h2 className={styles.list__heading}>
          <span className={styles.destaqie}>Veja</span>{" "}
          <span className={styles.secundario}>Abaixo</span>
        </h2>
        <p className={styles.list__intro}>
          Lista de Comunidades de Tecnologia e Programação em Moçambique
        </p>
        <div className={styles.list__actions}>
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
              className={styles.button__format}
            >
              {view === "grid" ? <FaList /> : <FaTh />}
            </button>
          </Tooltip>
        </div>
      </header>

      <div
        className={`${styles.list__items_container} ${view === "grid" ? styles.grid_view : styles.list_view}`}
      >
        {filteredData.map((item: ListaItem, index: number) => (
          <div key={index} className={styles.list__item}>
            <img
              src={
                item.logo ||
                "https://mozcomunidades.web.app/images/comunities/logo.png"
              }
              alt={item.title}
              className={styles.list__logo}
            />

            {view === "list" ? (
              <div className={styles.list__content}>
                <div className={styles.list__title}>
                  {item.title}
                </div>

                <div className={styles.categories}>
                  {item.categories.map((cat) => (
                    <span key={cat} className={styles.list__category}>
                      {categoryIconMap[cat as Category]}
                      {cat}
                    </span>
                  ))}
                </div>

                <div className={styles.list__row}>
                  <p className={styles.list__description}>{item.description}</p>
                  <Link
                    className={styles.list__more}
                    href={`/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Saber mais
                  </Link>
                </div>

                {isMobile && (
                  <div className={styles.events}>
                    <Events communityNames={[item.title]} />
                  </div>
                )}

                <div className={styles.list__social}>
                  {socialOrder.map((key) =>
                    item.social[key] && iconMap[key] ? (
                      <Link
                        key={key}
                        href={item.social[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles['list__social-icon']} ${styles[`list__social-${key}`]}`}
                        style={
                          { "--hover-color": item.color } as React.CSSProperties
                        }
                      >
                        {iconMap[key]}
                      </Link>
                    ) : null,
                  )}
                </div>

                <div className={styles.list__contact}>
                  {item.mail && (
                    <Link
                      href={`mailto:${item.mail}`}
                      className={styles['list__contact-button']}
                    >
                      Contactar
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <Link
                className={styles.list__title}
                href={`/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.title}
              </Link>
            )}

            {!isMobile && view === "list" && (
              <div className={styles.events}>
                <Events communityNames={[item.title]} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <p className={styles['list__no-results']}>Nenhuma comunidade encontrada.</p>
      )}
    </section>
  );
};

export default Communities;

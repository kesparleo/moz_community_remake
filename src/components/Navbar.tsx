import React, { useState, useEffect } from "react";
import styles from "../styles/Navbar.module.css";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import type { NavProps } from "../data/types";

const Navbar: React.FC<NavProps> = ({ logo, items, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
  const sections = document.querySelectorAll<HTMLElement>("section[id]");

  const onScroll = () => {
    const scrollY = window.scrollY;
    setIsTop(scrollY < 10);

    const scrollPos = scrollY + 120;

    sections.forEach((sec) => {
      if (
        scrollPos >= sec.offsetTop &&
        scrollPos < sec.offsetTop + sec.offsetHeight
      ) {
        setActiveSection(sec.id);
      }
    });
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);


  const [isMobile, setIsMobile] = useState(false);
  const renderLinks = () =>
  items.map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        const section = document.getElementById(item.id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setMenuOpen(false);
      }}
      className={`${styles.someOtherClass} ${activeSection === item.id ? styles.navbar__action : ""}`}
    >
      {item.label}
    </a>
  ));


  useEffect(() => {
  setIsMobile(window.innerWidth <= 768);

  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <nav className={`${styles.navbar} ${isTop ? styles["navbar--top"] : styles["navbar--scrolled"]}`}>
      <div className={styles.navbar__logo}>
        <img src={logo} alt="Logo Moz Communities" className={styles.logo} />
      </div>

      {!isMobile && (
        <div className={`${styles.navbar__links} ${menuOpen ? styles.active : ""}`}>
          <div className={styles.navbar__icons}>
            <div className={styles.theme__toggle} onClick={toggleTheme}>
              {theme === "light" ? (
                <FaSun className={styles.icon} />
              ) : (
                <FaMoon className={styles.icon} />
              )}
            </div>
          </div>
          {renderLinks()}
        </div>
      )}

      {isMobile && (
        <div className={styles.navbar__hamburger_and_theme}>
          <div className={styles.theme__toggle} onClick={toggleTheme}>
            {theme === "light" ? (
              <FaSun className={styles.icon} />
            ) : (
              <FaMoon className={styles.icon} />
            )}
          </div>
          <div
            className={styles.navbar__hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </div>
        </div>
      )}

      {isMobile && menuOpen && (
        <div className={`${styles.navbar__links} ${styles.active}`}>
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import styles from "../styles/Navbar.module.css";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import type { NavProps } from "../data/types";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useScrollSpy } from "../hooks/useScrollSpy";

const Navbar: React.FC<NavProps> = ({ items, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isTop, activeSection } = useScrollSpy(120);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  
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


  return (
    <nav className={`${styles.navbar} ${isTop ? styles["navbar--top"] : styles["navbar--scrolled"]}`}>
      <div className={styles.navbar__logo}>
        <img src='/mz_logo.png' alt="Logo Moz Communities" className={styles.logo} />
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

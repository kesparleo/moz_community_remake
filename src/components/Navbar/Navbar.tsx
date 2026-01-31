import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";

interface NavItem {
  id: string;
  label: string;
}

interface NavProps {
  title: string;
  items: NavItem[];
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const Navbar: React.FC<NavProps> = ({ title, items, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={`navbar ${isTop ? "navbar--top" : "navbar--scrolled"}`}>
      <div className="navbar__logo">{title}</div>

      {!isMobile && (
        <div className={`navbar__links ${menuOpen ? "active" : ""}`}>
          <div className="navbar__icons">
            <div className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? (
                <FaSun className="icon" />
              ) : (
                <FaMoon className="icon" />
              )}
            </div>
          </div>

          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className={activeSection === item.id ? "navbar__action" : ""}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {isMobile && (
        <div className="navbar__hamburger-and-theme">
          <div className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? (
              <FaSun className="icon" />
            ) : (
              <FaMoon className="icon" />
            )}
          </div>
          <div
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </div>
        </div>
      )}

      {isMobile && menuOpen && (
        <div className="navbar__links active">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className={activeSection === item.id ? "navbar__action" : ""}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

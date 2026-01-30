import React, { useState, useRef, useEffect } from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__bottom">
          <p>© {currentYear} ... Todos os direitos reservados.</p>
        </div>

        <div className="footer__author">
          <p className="footer__credits" ref={popoverRef}>
            Créditos:{" "}
            <button
              className="footer__link"
              onClick={() => setIsOpen((o) => !o)}
            >
              MozComunidades
            </button>
            {isOpen && (
              <span className="popover">
                <strong></strong>
                <br />
                <a
                  href="https://mozcomunidades.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mozcomunidades.web.app
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

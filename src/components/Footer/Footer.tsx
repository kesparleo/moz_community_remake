import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__bottom">
          <p>© {currentYear} <a href="https://mozcomunidades.web.app/" target="_blank" className="footer__link">MozComunidades</a> Alguns direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

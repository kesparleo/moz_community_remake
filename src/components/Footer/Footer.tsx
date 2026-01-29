import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__bottom">
          <p>© {currentYear} ... Todos os direitos reservados.</p>
        </div>
        <div className="footer__author">
          <p>
            Créditos: <a href="" target="_blank" rel="noopener noreferrer">...</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

/*<ol>
        <li>
          Comunities site:{" "}
          <a href="https://mozcomunidades.web.app/" target="_blank">
            Site
          </a>
        </li>
        <li>
          Github:{" "}
          <a
            href="https://github.com/RichaldoElias/ComunidadesMoz?tab=readme-ov-file#QA-Community-Moz"
            target="_blank"
          >
            Informations
          </a>
        </li>
      </ol>*/

export default Footer;

import React, { type JSX } from 'react';
import './List.css';
import { listaData, type ListaItem } from '../../data/community';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp} from 'react-icons/fa';

const iconMap: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  whatsapp: <FaWhatsapp />
};

const Communities: React.FC = () => {
  return (
    <section id='communities' className="lista">
      {listaData.map((item: ListaItem, index: number) => (
        <div key={index} className="lista__item">
          <img src={item.logo} alt={item.title} className="lista__logo" />
          <div className="lista__content">
            <h3 className="lista__title">{item.title}</h3>
            <p className="lista__description">{item.description}</p>
            <span>Website: <a href={item.website}>{item.website}</a></span>
            <div className="lista__social">
              {Object.entries(item.social).map(([key, url]) =>
                url && iconMap[key] ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`lista__social-icon lista__social-${key}`}
                  >
                    {iconMap[key]}
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Communities;

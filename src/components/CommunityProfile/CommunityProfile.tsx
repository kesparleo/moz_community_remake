import { useParams } from "react-router-dom";
import { listaData } from "../../data/community";
import {
  type ListaItem,
  type Category,
  type CommunityProfileProps,
} from "../../data/types";
import "./CommunityProfile.css";
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
  FaShieldAlt,
  FaPalette,
  FaMoon,
  FaSun,
  FaArrowLeft,
} from "react-icons/fa";
import Events from "../Events/EventCard";
import type { JSX } from "react";

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

const CommunityProfile: React.FC<CommunityProfileProps> = ({
  theme,
  setTheme,
}) => {
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const { id } = useParams<{ id: string }>();

  const community: ListaItem | undefined = listaData.find(
    (item) => item.title.toLowerCase().replace(/\s+/g, "-") === id,
  );

  if (!community) return <p>Comunidade não encontrada</p>;

  return (
    <div className="community-profile">
      <div className="community-profile__content">
        <section
          className="community-profile__card"
          style={
            { "--community-color": community.color } as React.CSSProperties
          }
        >
          <div className="--actions">
            <div className="back-button">
              <button onClick={() => window.history.back()}>
                <FaArrowLeft />
              </button>
            </div>
            <div className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? (
                <FaSun className="icon" />
              ) : (
                <FaMoon className="icon" />
              )}
            </div>
          </div>
          <img
            src={community.logo}
            alt={community.title}
            className="community-profile__logo"
          />

          <div className="community-profile__content">
            <h1 className="community-profile__title">{community.title}</h1>

            <div className="community-profile__categories">
              {community.categories.map((cat) => (
                <span key={cat} className="community-profile__category">
                  {categoryIconMap[cat as Category]} {cat}
                </span>
              ))}
            </div>

            <p className="community-profile__description">
              {community.description}
            </p>

            <span className="community-profile__link">
              <FaLink />
              {community.website ? (
                <a
                  className="community-profile__website"
                  href={community.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {community.website.replace(/^(https?:\/\/)?(www\.)?/, "")}
                </a>
              ) : (
                <span className="list__no-website">sem site</span>
              )}
            </span>

            <div className="community-profile__social">
              {socialOrder.map((key) =>
                community.social[key] && iconMap[key] ? (
                  <a
                    key={key}
                    href={community.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="community-profile__social-icon"
                    style={
                      {
                        "--hover-color": community.color,
                      } as React.CSSProperties
                    }
                  >
                    {iconMap[key]}
                  </a>
                ) : null,
              )}
            </div>

            <div className="community-profile__contact">
              {community.mail && (
                <a
                  href={`mailto:${community.mail}`}
                  className="community-profile__contact-button"
                >
                  Contactar
                </a>
              )}
            </div>

            <div className="events">
              <Events communityNames={[community.title]} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityProfile;

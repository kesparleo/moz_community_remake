import Link from "next/link";
import { useRouter } from "next/router";
import { listaData } from "../../data/community";
import {
  type ListaItem,
  type Category,
  type CommunityProfileProps,
} from "../../data/types";
import styles from "../../styles/CommunityProfile.module.css";
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
  FaCloud,
  FaCogs,
  FaUserSecret,
} from "react-icons/fa";
import Events from "../../components/EventCard";
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

const CommunityProfile: React.FC<CommunityProfileProps> = ({
  theme,
  setTheme,
}) => {
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const community: ListaItem | undefined = listaData.find(
    (item) => item.title.toLowerCase().replace(/\s+/g, "-") === id,
  );

  if (!community) return <p>Comunidade não encontrada</p>;

  return (
    <div className={styles.community__profile}>
      <div className="community-profile__content">
        <section
          className={styles.community__profile__card}
          style={
            { "--community-color": community.color } as React.CSSProperties
          }
        >
          <div className={styles.actions}>
            <div className={styles.back__button}>
              <button onClick={() => window.history.back()}>
                <FaArrowLeft />
              </button>
            </div>
            <div className={styles.theme__toggle} onClick={toggleTheme}>
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
            className={styles.community__profile__logo}
          />

          <div className="community-profile__content">
            <h1 className={styles.community__profile__title}>{community.title}</h1>

            <div className={styles.community__profile__categories}>
              {community.categories.map((cat) => (
                <span key={cat} className={styles.community__profile__category}>
                  {categoryIconMap[cat as Category]} {cat}
                </span>
              ))}
            </div>

            <p className={styles.community__profile__description}>
              {community.description}
            </p>

            <span className={styles.community__profile__link}>
              <FaLink />
              {community.website ? (
                <Link
                  className={styles.community__profile__website}
                  href={community.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {community.website.replace(/^(https?:\/\/)?(www\.)?/, "")}
                </Link>
              ) : (
                <span className="list__no-website">sem site</span>
              )}
            </span>

            <div className={styles.community__profile__social}>
              {socialOrder.map((key) =>
                community.social[key] && iconMap[key] ? (
                  <Link
                    key={key}
                    href={community.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.community__profile__social__icon}
                    style={
                      {
                        "--hover-color": community.color,
                      } as React.CSSProperties
                    }
                  >
                    {iconMap[key]}
                  </Link>
                ) : null,
              )}
            </div>

            <div className={styles.community__profile__contact}>
              {community.mail && (
                <Link
                  href={`mailto:${community.mail}`}
                  className={styles.community__profile__contact__button}
                >
                  Contactar
                </Link>
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

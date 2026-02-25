import React, { type JSX } from "react";
import Link from "next/link";
import styles from "../styles/List.module.css";
import { type Category, type Props } from "../data/types";
import Events from "./EventCard";
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
  FaUserSecret,
  FaCloud,
  FaCogs,
} from "react-icons/fa";
import { socialOrder } from "../data/data";

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

const CommunityCard: React.FC<Props> = ({ item, view, isMobile }) => {
  return (
    <div className={styles.list__item}>
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
          <div className={styles.list__title}>{item.title}</div>

          <div className={styles.categories}>
            {item.categories.map((cat) => (
              <span key={cat} className={styles.list__category}>
                {categoryIconMap[cat]} {cat}
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
            {(() => {
              const socialKeys = socialOrder.filter(
                (key) => item.social[key] && iconMap[key],
              );
              const firstTwo = socialKeys.slice(0, 3);
              const remaining = socialKeys.slice(3);

              return (
                <>
                  {firstTwo.map((key) => (
                    <Link
                      key={key}
                      href={item.social[key]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles["list__social-icon"]} ${styles[`list__social-${key}`]}`}
                      style={
                        { "--hover-color": item.color } as React.CSSProperties
                      }
                    >
                      {iconMap[key]}
                    </Link>
                  ))}
                  {remaining.length > 0 && (
                    <div
                      className={`${styles["list__social-icon"]} ${styles["list__social-more"]}`}
                      style={
                        { "--hover-color": item.color } as React.CSSProperties
                      }
                      title={remaining
                        .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                        .join(", ")}
                    >
                      +{remaining.length}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div className={styles.list__contact}>
            {item.mail && (
              <Link
                href={`mailto:${item.mail}`}
                className={styles["list__contact-button"]}
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
  );
};

export default CommunityCard;

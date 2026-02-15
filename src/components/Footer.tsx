import styles from "../styles/Footer.module.css";
import type { FooterProps } from "../data/types";

const Footer: React.FC<FooterProps> = ({
  copyrightHolderName,
  copyrightHolderUrl,
  redesignAuthorName,
  redesignAuthorUrl,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__bottom}>
          <p>
            © {currentYear}{" "}
            <a
              href={copyrightHolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footer__link}
            >
              {copyrightHolderName}
            </a>
            . Todos direitos reservados. Remodelação visual e técnica independente por {" "}
            <a
              href={redesignAuthorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footer__link}
            >
              {redesignAuthorName}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

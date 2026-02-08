import React from "react";
import styles from "../styles/CollaborateButton.module.css";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import Tooltip from "./Tooltip";
import type { CollaborateButtonProps } from "../data/types";
import Link from "next/link";

const CollaborateButton: React.FC<CollaborateButtonProps> = ({ mail, githubUrl }) => {

  return (
    <div id="contact" className={styles['collaborate-wrapper']}>
      <Tooltip text="Colabore com uma mensagem" position="up" duration={3000} delay={4000}>
        <Link
          href={`mailto:${mail}?subject=Colaboração%20com%20o%20projecto`}
          className={styles.collaborate}
        >
          <FaEnvelope />
        </Link>
      </Tooltip>

      <Tooltip text="⭐ Deixe uma estrela" position="down">
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.hero__github}
        >
          <FaGithub className={styles['hero__github-icon']} />
        </Link>
      </Tooltip>
    </div>
  );
};

export default CollaborateButton;

import React, { useState } from "react";
import styles from "../styles/CollaborateButton.module.css";
import type { CollaborateButtonProps } from "../data/types";
import CommunityModal from "./newCommunity";
import Link from "next/link";
import { FaGithub, FaPlus } from "react-icons/fa";

const CollaborateButton: React.FC<CollaborateButtonProps> = ({ githubUrl }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div id="contact" className={styles.wrapper}>
      <div className={styles.container}>
        <button
          onClick={() => setModalOpen(true)}
          className={styles.collaborate}
        >
          <FaPlus className={styles.icon} />
          Nova Comunidade
        </button>

        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.github}
          aria-label="Ver repositório no GitHub"
        >
          <FaGithub />
        </Link>
      </div>

      {isModalOpen && <CommunityModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default CollaborateButton;

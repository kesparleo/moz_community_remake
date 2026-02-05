import React from "react";
import "./CollaborateButton.css";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import Tooltip from "../Tooltip/Tooltip";
import type { CollaborateButtonProps } from "../../data/types";

const CollaborateButton: React.FC<CollaborateButtonProps> = ({ mail, githubUrl }) => {

  return (
    <div id="contact" className="collaborate-wrapper">
      <Tooltip text="Colabore com uma mensagem" position="up" duration={3000} delay={4000}>
        <a
          href={`mailto:${mail}?subject=Colaboração%20com%20o%20projecto`}
          className="collaborate"
        >
          <FaEnvelope />
        </a>
      </Tooltip>

      <Tooltip text="⭐ Deixe uma estrela" position="down">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hero__github"
        >
          <FaGithub className="hero__github-icon" />
        </a>
      </Tooltip>
    </div>
  );
};

export default CollaborateButton;

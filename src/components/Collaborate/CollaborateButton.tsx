import React from "react";
import "./CollaborateButton.css";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import Tooltip from "../Tooltip/Tooltip";
import type { CollaborateButtonProps } from "../../data/types";

const CollaborateButton: React.FC<CollaborateButtonProps> = ({ githubUrl }) => {
  const user = "kespar299";
  const domain = "gmail.com";
  const email = `${user}@${domain}`;

  const urlParts = githubUrl.split("/");
  const obfuscatedUrl = `${urlParts[0]}//${urlParts[2]}/${urlParts[3]}/${urlParts[4]}`;

  return (
    <div id="contact" className="collaborate-wrapper">
      <Tooltip text="Colabore com uma mensagem" position="up" duration={3000} delay={4000}>
        <a
          href={`mailto:${email}?subject=Colaboração%20com%20a%20comunidade`}
          className="collaborate"
        >
          <FaEnvelope />
        </a>
      </Tooltip>

      <Tooltip text="⭐ Deixe uma estrela" position="left">
        <a
          href={obfuscatedUrl}
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

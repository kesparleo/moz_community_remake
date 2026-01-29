import React from "react";
import "./CollaborateButton.css";
import { FaEnvelope } from "react-icons/fa";

const CollaborateButton: React.FC = () => {
  const user = "kespar299";
  const domain = "gmail.com";
  const email = `${user}@${domain}`;

  return (
    <div id="contact" className="collaborate-wrapper">
      <a
        href={`mailto:${email}?subject=Colaboração%20com%20a%20comunidade`}
        className="collaborate"
      >
        <FaEnvelope />
        <span>Colaborar</span>
      </a>
    </div>
  );
};

export default CollaborateButton;

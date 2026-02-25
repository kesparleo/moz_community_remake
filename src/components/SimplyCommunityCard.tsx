import React from "react";
import styles from "../styles/SimplyCommunityCard.module.css";
import { type Props } from "../data/types";

const SimpleCommunityCard: React.FC<Props> = ({ item }) => {
  return (
    <div className={styles.card__format}>
      <div className={styles.image_wrapper}>
        <img
          src={item.logo || "https://mozcomunidades.web.app/images/comunities/logo.png"}
          alt={item.title}
          className={styles.card_logo}
        />
      </div>
      <h3 className={styles.card_name}>{item.title}</h3>
    </div>
  );
};

export default SimpleCommunityCard;
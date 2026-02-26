import React from "react";
import Link from "next/link";
import styles from "../styles/SimplyCommunityCard.module.css";
import { type Props } from "../data/types";

const SimpleCommunityCard: React.FC<Props> = ({ item }) => {
  const id = item.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/community/${id}`} className={styles.card__format} style={{ "--accent": item.color } as React.CSSProperties}>
      <div className={styles.image_wrapper}>
        <img
          src={item.logo || "https://mozcomunidades.web.app/images/comunities/logo.png"}
          alt={item.title}
          className={styles.card_logo}
        />
      </div>
      <h3 className={styles.card_name}>{item.title}</h3>
    </Link>
  );
};

export default SimpleCommunityCard;
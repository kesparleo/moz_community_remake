import { FaArrowUp } from "react-icons/fa";
import styles from "../styles/ScrollTopButton.module.css";
import { useScrollThreshold } from "../hooks/useScrollThreshold";

const ScrollTopButton: React.FC = () => {
  const visible = useScrollThreshold(200);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`${styles.scroll__top} ${visible ? styles.show : ""}`}
      onClick={scrollToTop}
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollTopButton;

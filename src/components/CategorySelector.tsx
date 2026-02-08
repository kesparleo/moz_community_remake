import React, { useState } from "react";
import styles from '../styles/CategorySelector.module.css';
import type { CategorySelectorProps } from "../data/types";

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.category__selector}>
      <button
        className={styles.button__format}
        onClick={() => setOpen(!open)}
      >
        {selectedCategory || "Categoria"}
      </button>

      {open && (
        <ul className={styles.category__selector__list}>
          <li
            className={styles.category__selector__item}
            onClick={() => {
              setSelectedCategory("");
              setOpen(false);
            }}
          >
            Todas
          </li>
          {categories.slice().sort().map((cat) => (
            <li
              key={cat}
              className={styles.category__selector__item}
              onClick={() => {
                setSelectedCategory(cat);
                setOpen(false);
              }}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategorySelector;

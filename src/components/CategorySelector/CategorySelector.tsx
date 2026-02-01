import React, { useState } from "react";
import './CategorySelector.css';
import type { CategorySelectorProps } from "../../data/types";

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="category-selector">
      <button
        className="category-selector__button"
        onClick={() => setOpen(!open)}
      >
        {selectedCategory || "Categoria"}
      </button>

      {open && (
        <ul className="category-selector__list">
          <li
            className="category-selector__item"
            onClick={() => {
              setSelectedCategory("");
              setOpen(false);
            }}
          >
            Todas
          </li>
          {categories.map((cat) => (
            <li
              key={cat}
              className="category-selector__item"
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

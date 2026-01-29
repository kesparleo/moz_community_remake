import React, { useState } from "react";
import './CategorySelector.css';
import type { Category } from "../../data/community";

interface CategorySelectorProps {
  categories: Category[];           // agora é Category[]
  selectedCategory: Category | "";  // mesma tipagem do estado
  setSelectedCategory: (category: Category | "") => void; // aceita vazio
}

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
              setSelectedCategory(""); // "Todas"
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

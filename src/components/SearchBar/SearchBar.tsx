import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import type { SearchBarProps } from "../../data/types";

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`search-bar ${expanded ? "expanded" : ""}`}>
      <button
        className="search-bar__icon"
        onClick={() => setExpanded(!expanded)}
        aria-label="Pesquisar"
      >
        <FaSearch />
      </button>
      <input
        type="text"
        placeholder="Pesquisar por nome..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-bar__input"
      />
    </div>
  );
};

export default SearchBar;

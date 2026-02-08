import React from "react";
import styles from "../styles/List.module.css";
import { useCommunities } from "../hooks/useCommunities";
import SearchBar from "./SearchBar";
import CategorySelector from "./CategorySelector";
import Tooltip from "./Tooltip";
import CommunityCard from '../components/communityCard'

const Communities: React.FC = () => {
  const {
    view,
    setView,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isMobile,
    filteredData,
    allCategories,
  } = useCommunities();

  return (
    <section id="communities" className={`${styles.list} ${styles.list__background}`}>
      <header className={styles.list__header}>
        <h2 className={styles.list__heading}>
          <span className={styles.destaqie}>Veja</span>{" "}
          <span className={styles.secundario}>Abaixo</span>
        </h2>
        <p className={styles.list__intro}>
          Lista de Comunidades de Tecnologia e Programação em Moçambique
        </p>
        <div className={styles.list__actions}>
          <Tooltip text="Pesquise por nome" position="left" duration={4000}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Tooltip>
          <Tooltip text="Busque por categoria" duration={6000} delay={5000}>
            <CategorySelector
              categories={allCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Tooltip>
          <Tooltip text="Lista / Grelha" position="down" delay={7000} duration={4000}>
            <button onClick={() => setView(view === "grid" ? "list" : "grid")} className={styles.button__format}>
              {view === "grid" ? "List" : "Grid"}
            </button>
          </Tooltip>
        </div>
      </header>

      <div className={`${styles.list__items_container} ${view === "grid" ? styles.grid_view : styles.list_view}`}>
        {filteredData.map((item, index) => (
          <CommunityCard key={index} item={item} view={view} isMobile={isMobile} />
        ))}
      </div>

      {filteredData.length === 0 && <p className={styles['list__no-results']}>Nenhuma comunidade encontrada.</p>}
    </section>
  );
};

export default Communities;

import React from "react";
import styles from "../styles/List.module.css";
import SimpleCommunityCard from "./SimplyCommunityCard";
import type { ListaItem, Category } from "../data/types";
import { listaData } from "../data/community";


const CATEGORY_INFO: Record<Category, { title: string; description: string }> = {
  Coding: {
    title: "Desenvolvimento & Programação",
    description: "Comunidades focadas em escrita de código, frameworks e engenharia de software."
  },
  Design: {
    title: "Design & Experiência do Usuário",
    description: "Espaços dedicados a UI/UX, Design Gráfico e criatividade visual."
  },
  Data: {
    title: "Dados & Inteligência Artificial",
    description: "Grupos que exploram Ciência de Dados, IA e análise de informações."
  },
  Networks: {
    title: "Infraestrutura & Cibersegurança",
    description: "Especialistas em redes, segurança digital e administração de sistemas."
  },
  "Artificial Intelligence": {
    title: "",
    description: ""
  },
  Cloud: {
    title: "",
    description: ""
  },
  Infrastructure: {
    title: "",
    description: ""
  },
  Hacking: {
    title: "",
    description: ""
  },
  Cybersecurity: {
    title: "",
    description: ""
  }
};

const TARGET_CATEGORIES: Category[] = ["Coding", "Design", "Data", "Networks"];

const Communities: React.FC = () => {
  const categoriesMap = TARGET_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = listaData.filter(item => item.categories.includes(cat));
    return acc;
  }, {} as Record<Category, ListaItem[]>);

  return (
    <section className={styles.container_principal}>
      {TARGET_CATEGORIES.map(category => {
        const items = categoriesMap[category];
        const info = CATEGORY_INFO[category];
        
        if (!items || items.length === 0) return null;

        return (
          <div key={category} className={styles.category_section}>
            <div className={styles.header_group}>
              <h2 className={styles.section_title}>{info?.title || category}</h2>
              <p className={styles.section_description}>{info?.description}</p>
            </div>
            
            <div className={styles.grid_view}>
              {items.map(item => (
                <SimpleCommunityCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Communities;

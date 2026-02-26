import { useEffect, useRef } from "react";
import styles from "../styles/List.module.css";
import SimpleCommunityCard from "./SimplyCommunityCard";
import type { Category } from "../data/types";
import { listaData } from "../data/community";

const CATEGORY_INFO: Record<Category, { title: string; description: string }> =
  {
    Coding: {
      title: "Desenvolvimento",
      description:
        "Programação, arquitecturas, frameworks e boas práticas de engenharia....",
    },

    Design: {
      title: "Design Digital e UX/UI",
      description:
        "Concepção de interfaces, experiência do utilizador, design visual e sistemas de design.",
    },

    Data: {
      title: "Ciência e Engenharia de Dados",
      description:
        "Análise, processamento e modelação de dados para suporte à decisão e sistemas inteligentes.",
    },

    Networks: {
      title: "Redes e Administração de Sistemas",
      description:
        "Configuração, gestão e optimização de infraestruturas de rede e sistemas operativos.",
    },

    "Artificial Intelligence": {
      title: "Inteligência Artificial e Machine Learning",
      description:
        "Modelos preditivos, aprendizagem automática, redes neuronais e sistemas autónomos.",
    },

    Cloud: {
      title: "Computação em Nuvem",
      description:
        "Serviços cloud, contentorização, orquestração e arquitecturas distribuídas escaláveis.",
    },

    Infrastructure: {
      title: "Arquitectura e Infraestrutura de TI",
      description:
        "Planeamento e manutenção de servidores, data centers e ambientes empresariais complexos.",
    },

    Hacking: {
      title: "Segurança Ofensiva e Pentesting",
      description:
        "Testes de penetração, análise de vulnerabilidades e avaliação ética de segurança.",
    },

    Cybersecurity: {
      title: "Segurança Informática e Protecção de Dados",
      description:
        "Defesa contra ameaças digitais, gestão de risco e conformidade normativa.",
    },
  };

const TARGET_CATEGORIES: Category[] = ["Coding", "Design", "Data", "Networks"];

const Communities: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isFocused);
          } else {
            entry.target.classList.remove(styles.isFocused);
          }
        });
      },
      { threshold: 0.3 },
    );

    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {TARGET_CATEGORIES.map((category, index) => {
        const items = listaData.filter((item) =>
          item.categories.includes(category),
        );
        const info = CATEGORY_INFO[category];

        if (items.length === 0) return null;

        return (
          <section
            key={category}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[index] = el;
            }}
            className={styles.focusSection}
          >
            <div className={styles.innerContent}>
              <header className={styles.header}>
                <h2 className={styles.title}>{info?.title}</h2>
                <p className={styles.description}>{info?.description}</p>
              </header>

              <div className={styles.grid}>
                {items.map((item) => (
                  <SimpleCommunityCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Communities;

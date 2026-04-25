import type { Category } from "./types";

export const CATEGORY_INFO: Record<
  Category,
  { title: string; description: string }
> = {
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
  General: {
    title: "Tecnologia Geral",
    description:
      "Comunidades tecnológicas de âmbito transversal, que abrangem múltiplas áreas do ecossistema digital, desde programação e dados até design, infraestruturas e inovação. Funcionam como espaços de partilha, aprendizagem e networking, permitindo a troca de experiências entre perfis diversos e promovendo uma visão integrada da tecnologia.",
  },
};

import { useState, useEffect } from "react";
import type { ListaItem, Category } from "../data/types";

function parsePgArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  return value.replace(/^{|}$/g, "").split(",").filter(Boolean);
}

export function useCommunities() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [isMobile, setIsMobile] = useState(false);
  const [communities, setCommunities] = useState<ListaItem[]>([]);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 1023);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/communities");

        if (!res.ok) {
          console.warn(
            `⚠️ Falha ao chamar API de comunidades: HTTP ${res.status} - ${res.statusText}`
          );
          setCommunities([]);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("⚠️ API não retornou array de comunidades:", data);
          setCommunities([]);
          return;
        }

        const normalized: ListaItem[] = data.map((item: any) => ({
          ...item,
          categories: parsePgArray(item.categories) as Category[],
          social: item.social ?? {},
        }));

        console.log("✅ Comunidades carregadas com sucesso:", normalized.length, "registos");

        setCommunities(normalized.sort(() => Math.random() - 0.5));
      } catch (err: unknown) {
        let message = "Erro desconhecido ao carregar comunidades";

        if (err instanceof Error) message = err.message;

        console.error("❌ Erro ao buscar comunidades:", message, "\nDetalhes:", err);
        setCommunities([]);
      }
    }
    load();
  }, []);

  const allCategories = Array.from(new Set(communities.flatMap(c => c.categories)));

  const filteredData = communities.filter(
    c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || c.categories.includes(selectedCategory))
  );

  return {
    view,
    setView,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isMobile,
    communities,
    filteredData,
    allCategories,
  };
}

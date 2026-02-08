import type { NextApiRequest, NextApiResponse } from "next";
import { getAllCommunities } from "../../../repository/community.repository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const rows = await getAllCommunities();

    const normalized = rows.map(row => ({
      ...row,
      categories: Array.isArray(row.categories) ? row.categories : [],
      social: row.social ?? {},
    }));

    console.log("✅ Comunidades carregadas com sucesso:", normalized.length, "registos");

    res.status(200).json(normalized);
  } catch (err: unknown) {
    let message = "Erro desconhecido ao carregar comunidades";
    if (err instanceof Error) message = err.message;

    console.error("❌ Falha na API de comunidades:", message, "\nStack:", err);

    res.status(200).json([]); 
  }
}

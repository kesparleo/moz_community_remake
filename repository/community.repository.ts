import { pool } from "../lib/db";

export async function getAllCommunities() {
  const query = `
    SELECT 
      c.id,
      c.logo,
      c.title,
      c.description,
      c.website,
      c.mail,
      c.social,
      c.color,
      COALESCE(
        array_agg(cc.category) FILTER (WHERE cc.category IS NOT NULL),
        '{}'
      ) AS categories
    FROM communities c
    LEFT JOIN community_categories cc
      ON cc.community_id = c.id
    GROUP BY c.id
    ORDER BY c.id;
  `;

  const { rows } = await pool.query(query);
  console.log(query)
  console.log("Rows retornadas do banco:", rows.length);
  return rows;
}

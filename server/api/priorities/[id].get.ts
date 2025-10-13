import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const { rows } = await pool.query("SELECT * FROM priority WHERE id = $1", [
    id,
  ]);

  if (rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Приоритет не найден",
    });
  }

  return rows[0];
});

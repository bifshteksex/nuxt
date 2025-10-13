import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { rows } = await pool.query("SELECT * FROM priority ORDER BY id");
  return rows;
});

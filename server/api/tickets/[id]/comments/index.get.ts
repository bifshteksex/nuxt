import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const ticketId = parseInt(getRouterParam(event, "id")!);

  const { rows } = await pool.query(
    "SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at ASC",
    [ticketId]
  );

  return rows;
});

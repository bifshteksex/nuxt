import pool from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const ticketId = parseInt(getRouterParam(event, "id")!);
  const { userId, content } = await readBody(event);
  const currentUser = event.context.user;

  // Используем ID текущего пользователя
  const actualUserId = userId || currentUser.id;

  const { rows } = await pool.query(
    "INSERT INTO comments (ticket_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [ticketId, actualUserId, content]
  );

  return rows[0];
});

import { TicketModel } from "~/server/models/Ticket";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const user = event.context.user;

  // Только админы могут удалять тикеты
  if (!user.roles.includes("admin")) {
    throw createError({
      statusCode: 403,
      message: "Недостаточно прав",
    });
  }

  await TicketModel.delete(id);
  return { success: true };
});

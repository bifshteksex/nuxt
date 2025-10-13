import { TicketModel } from "~/server/models/Ticket";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const ticket = await TicketModel.findById(id);

  if (!ticket) {
    throw createError({
      statusCode: 404,
      message: "Тикет не найден",
    });
  }

  return ticket;
});

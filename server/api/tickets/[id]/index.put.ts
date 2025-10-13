import { TicketModel } from "~/server/models/Ticket";
import { StatusModel } from "~/server/models/Status";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const body = await readBody(event);
  const user = event.context.user;

  const currentTicket = await TicketModel.findById(id);
  if (!currentTicket) {
    throw createError({
      statusCode: 404,
      message: "Тикет не найден",
    });
  }

  // Проверка изменения статуса
  if (body.status_id && body.status_id !== currentTicket.status_id) {
    const validation = await StatusModel.canTransition(
      currentTicket.status_id,
      body.status_id,
      user.roles,
      user.id,
      currentTicket.assigned_to
    );

    if (!validation.allowed) {
      throw createError({
        statusCode: 403,
        message: validation.reason || "Переход не разрешен",
      });
    }
  }

  const updatedTicket = await TicketModel.update(id, body);
  return updatedTicket;
});

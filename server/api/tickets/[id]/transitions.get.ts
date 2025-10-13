import { TicketModel } from "~/server/models/Ticket";
import { StatusModel } from "~/server/models/Status";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const user = event.context.user;

  const ticket = await TicketModel.findById(id);
  if (!ticket) {
    throw createError({
      statusCode: 404,
      message: "Тикет не найден",
    });
  }

  const transitions = await StatusModel.getTransitions(ticket.status_id);

  // Фильтруем доступные переходы
  const availableTransitions = [];
  for (const transition of transitions) {
    const validation = await StatusModel.canTransition(
      ticket.status_id,
      transition.to_status_id,
      user.roles,
      user.id,
      ticket.assigned_to
    );

    if (validation.allowed) {
      availableTransitions.push(transition);
    }
  }

  return availableTransitions;
});

import { TicketModel } from "~/server/models/Ticket";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const user = event.context.user;

  const filters: any = {};

  if (query.status_id) {
    filters.status_id = parseInt(query.status_id as string);
  }

  // Не-админы видят только свои тикеты
  if (!user.roles.includes("admin") && !user.roles.includes("route")) {
    filters.user_id = user.id;
  } else if (query.user_id) {
    filters.user_id = parseInt(query.user_id as string);
  }

  const tickets = await TicketModel.findAll(filters);
  return tickets;
});

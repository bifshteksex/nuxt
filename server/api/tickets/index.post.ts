import { TicketModel } from "~/server/models/Ticket";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;

  const ticketData = {
    title: body.title,
    description: body.description,
    status_id: body.status_id || 1,
    priority_id: body.priority_id || 1,
    category: body.category,
    created_by: body.created_by || user.id,
    assigned_to: body.assigned_to,
  };

  const ticket = await TicketModel.create(ticketData);
  return ticket;
});

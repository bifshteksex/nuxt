import { StatusModel } from "~/server/models/Status";

export default defineEventHandler(async (event) => {
  const { order } = await readBody(event);
  const user = event.context.user;

  if (!user.roles.includes("admin")) {
    throw createError({
      statusCode: 403,
      message: "Недостаточно прав",
    });
  }

  await StatusModel.updatePositions(order);
  return { success: true, message: "Позиции обновлены" };
});

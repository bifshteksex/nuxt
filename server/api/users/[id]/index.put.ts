import { UserModel } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const body = await readBody(event);
  const currentUser = event.context.user;

  // Проверка прав
  if (!currentUser.roles.includes("admin") && currentUser.id !== id) {
    throw createError({
      statusCode: 403,
      message: "Недостаточно прав",
    });
  }

  // Обновление ролей (только для админов)
  if (body.role_ids && currentUser.roles.includes("admin")) {
    await UserModel.updateUserRoles(id, body.role_ids);
  }

  // Обновление данных пользователя
  const updateData: any = {};
  if (body.email) updateData.email = body.email;
  if (body.first_name) updateData.first_name = body.first_name;
  if (body.last_name) updateData.last_name = body.last_name;
  if (body.avatar !== undefined) updateData.avatar = body.avatar;

  const updatedUser = await UserModel.update(id, updateData);
  return updatedUser;
});

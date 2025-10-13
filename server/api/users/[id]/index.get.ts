import { UserModel } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);

  const user = await UserModel.findById(id);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: "Пользователь не найден",
    });
  }

  const roles = await UserModel.getUserRoles(id);

  return { ...user, roles };
});

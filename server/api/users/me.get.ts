import { UserModel } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const userData = await UserModel.findById(user.id);
  if (!userData) {
    throw createError({
      statusCode: 404,
      message: "Пользователь не найден",
    });
  }

  const roles = await UserModel.getUserRoles(user.id);

  return {
    ...userData,
    roles,
  };
});

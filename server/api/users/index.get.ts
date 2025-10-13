import { UserModel } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const users = await UserModel.findAll();

  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      const roles = await UserModel.getUserRoles(user.id);
      return { ...user, roles };
    })
  );

  return usersWithRoles;
});

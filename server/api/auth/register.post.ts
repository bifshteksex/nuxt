import bcrypt from "bcryptjs";
import { UserModel } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const { first_name, last_name, email, password } = await readBody(event);

  if (!email || !password || !first_name || !last_name) {
    throw createError({
      statusCode: 400,
      message: "Все поля обязательны",
    });
  }

  // Проверка существования пользователя
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: "Пользователь с таким email уже существует",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create(
    first_name,
    last_name,
    email,
    hashedPassword
  );

  return {
    id: newUser.id,
    email: newUser.email,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
  };
});

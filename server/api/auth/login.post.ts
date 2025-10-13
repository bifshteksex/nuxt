import bcrypt from "bcryptjs";
import { UserModel } from "~/server/models/User";
import { signToken } from "~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email и пароль обязательны",
    });
  }

  const user = await UserModel.findByEmail(email);

  if (!user) {
    throw createError({
      statusCode: 400,
      message: "Неверные учетные данные",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError({
      statusCode: 400,
      message: "Неверные учетные данные",
    });
  }

  const token = signToken({ id: user.id, email: user.email });

  return { token };
});

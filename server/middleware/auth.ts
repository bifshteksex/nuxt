import { getUserFromToken } from "../utils/jwt";

export default defineEventHandler(async (event) => {
  // Пропускаем публичные роуты
  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/priorities",
  ];
  if (publicRoutes.some((route) => event.path.startsWith(route))) {
    return;
  }

  // Проверяем API роуты
  if (!event.path.startsWith("/api/")) {
    return;
  }

  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Требуется авторизация",
    });
  }

  try {
    const user = await getUserFromToken(token);
    event.context.user = user;
  } catch (error) {
    throw createError({
      statusCode: 403,
      message: "Недействительный токен",
    });
  }
});

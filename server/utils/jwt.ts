import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface JWTPayload {
  id: number;
  email: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Недействительный токен",
    });
  }
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  const pool = await import("./db").then((m) => m.default);

  const { rows } = await pool.query(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [decoded.id]
  );

  return {
    id: decoded.id,
    email: decoded.email,
    roles: rows.map((r) => r.name),
  };
}

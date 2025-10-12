const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Получаем роли пользователя
    const { rows } = await pool.query(
      `
      SELECT r.name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `,
      [decoded.id]
    );

    req.user = {
      id: decoded.id,
      roles: rows.map((r) => r.name),
    };

    next();
  } catch (err) {
    console.error("Ошибка аутентификации:", err);
    return res.status(403).json({ error: "Недействительный токен" });
  }
}

module.exports = { authenticateToken };

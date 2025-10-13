// server/utils/db.ts
import { Pool } from "pg";

// Проверяем наличие переменных окружения
const requiredEnvVars = [
  "PGUSER",
  "PGHOST",
  "PGDATABASE",
  "PGPASSWORD",
  "PGPORT",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Отсутствуют переменные окружения:", missingVars.join(", "));
  throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
}

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: String(process.env.PGPASSWORD), // Явно приводим к строке
  port: parseInt(process.env.PGPORT || "5432", 10),
  max: 20, // Максимум соединений в пуле
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Тест подключения
pool.on("connect", () => {
  console.log("✅ Подключение к PostgreSQL установлено");
});

pool.on("error", (err) => {
  console.error("❌ Неожиданная ошибка PostgreSQL:", err);
});

export async function initializeDatabase() {
  let client;
  try {
    console.log("📊 Подключение к базе данных...");
    client = await pool.connect();
    console.log("✅ Успешно подключено к PostgreSQL");

    // Таблица users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Таблица roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT
      );
    `);

    // Таблица user_roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
        UNIQUE(user_id, role_id)
      );
    `);

    // Таблица priority
    await client.query(`
      CREATE TABLE IF NOT EXISTS priority (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    // Таблица statuses
    await client.query(`
      CREATE TABLE IF NOT EXISTS statuses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        position INTEGER DEFAULT 0
      );
    `);

    // Таблица tickets
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status_id INTEGER REFERENCES statuses(id),
        priority_id INTEGER REFERENCES priority(id),
        category VARCHAR(100),
        created_by INTEGER REFERENCES users(id),
        assigned_to INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Таблица comments
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Таблица status_transitions
    await client.query(`
      CREATE TABLE IF NOT EXISTS status_transitions (
        id SERIAL PRIMARY KEY,
        from_status_id INTEGER REFERENCES statuses(id),
        to_status_id INTEGER REFERENCES statuses(id),
        required_role VARCHAR(50) NOT NULL,
        requires_assignment BOOLEAN DEFAULT FALSE,
        UNIQUE(from_status_id, to_status_id, required_role)
      );
    `);

    console.log("✅ Все таблицы инициализированы успешно");
  } catch (err) {
    console.error("❌ Ошибка инициализации базы данных:", err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export default pool;

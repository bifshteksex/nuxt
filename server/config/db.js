const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function initializeDatabase() {
  try {
    const client = await pool.connect();

    // Проверка и создание таблицы users
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `;
    await client.query(createUsersTableQuery);
    console.log("Таблица users создана или уже существует.");

    // Проверка и создание таблицы comments
    const createCommentsTableQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createCommentsTableQuery);
    console.log("Таблица comments создана или уже существует.");

    // Проверка и создание таблицы priorities
    const createPrioritiesTableQuery = `
      CREATE TABLE IF NOT EXISTS priorities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `;
    await client.query(createPrioritiesTableQuery);
    console.log("Таблица priorities создана или уже существует.");

    // Проверка и создание таблицы roles
    const createRolesTableQuery = `
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `;
    await client.query(createRolesTableQuery);
    console.log("Таблица roles создана или уже существует.");

    // Проверка и создание таблицы statuses
    const createStatusesTableQuery = `
      CREATE TABLE IF NOT EXISTS statuses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `;
    await client.query(createStatusesTableQuery);
    console.log("Таблица statuses создана или уже существует.");

    // Проверка и создание таблицы tickets
    const createTicketsTableQuery = `
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        priority_id INTEGER REFERENCES priorities(id),
        status_id INTEGER REFERENCES statuses(id),
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTicketsTableQuery);
    console.log("Таблица tickets создана или уже существует.");

    client.release();
  } catch (err) {
    console.error("Ошибка инициализации базы данных:", err);
  }
}

initializeDatabase();

module.exports = pool;

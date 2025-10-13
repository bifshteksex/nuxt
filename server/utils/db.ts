import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
});

export async function initializeDatabase() {
  try {
    const client = await pool.connect();

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

    client.release();
    console.log("✅ База данных инициализирована успешно");
  } catch (err) {
    console.error("❌ Ошибка инициализации базы данных:", err);
  }
}

export default pool;

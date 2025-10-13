// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Загружаем .env файл
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, ".env") });

export default defineNuxtConfig({
  compatibilityDate: "2025-11-11",
  routeRules: {
    "/": { redirect: "/welcome" },
  },
  devtools: { enabled: true },

  runtimeConfig: {
    // Server-side переменные (приватные)
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT,
    jwtSecret: process.env.JWT_SECRET,

    // Public переменные (доступны на клиенте)
    public: {
      apiBase: "/api",
    },
  },

  nitro: {
    preset: "node-server",
    compressPublicAssets: true,

    // Передаем переменные окружения в Nitro
    runtimeConfig: {
      pgUser: process.env.PGUSER,
      pgHost: process.env.PGHOST,
      pgDatabase: process.env.PGDATABASE,
      pgPassword: process.env.PGPASSWORD,
      pgPort: process.env.PGPORT,
      jwtSecret: process.env.JWT_SECRET,
    },

    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },

  modules: ["@nuxt/icon", "@nuxt/image", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});

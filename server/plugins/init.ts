import { initializeDatabase } from "../utils/db";

export default defineNitroPlugin(async (nitroApp) => {
  console.log("🚀 Инициализация Nitro сервера...");
  await initializeDatabase();
});

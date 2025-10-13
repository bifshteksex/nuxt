// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-11",
  routeRules: {
    "/": { redirect: "/welcome" },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "/api",
    },
  },
  nitro: {
    // Настройки для production
    preset: "node-server",
    compressPublicAssets: true,

    // Предварительная компиляция
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

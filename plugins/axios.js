import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: "/api",
  });

  // Interceptor для добавления токена к каждому запросу
  api.interceptors.request.use(
    (config) => {
      if (import.meta.client) {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor для обработки ошибок
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (import.meta.client && error.response?.status === 401) {
        localStorage.removeItem("token");
        navigateTo("/login");
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});

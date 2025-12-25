import axios from "axios";

const isProduction = import.meta.env.PROD;
const baseURL = isProduction ? "/api" : (import.meta.env.VITE_BASE_URL || "/api");

console.log("API Base URL:", baseURL);

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

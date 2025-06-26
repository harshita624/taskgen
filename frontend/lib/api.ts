// lib/api.ts (client-side only)
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = await window.Clerk?.session?.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;

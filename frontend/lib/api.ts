// lib/api.ts
import axios from "axios";
import { getToken } from "@clerk/nextjs/server"; // server side
import { clerkClient } from "@clerk/nextjs"; // optional

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Attach token to every request (client-side)
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = await window.Clerk?.session?.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const localToken = localStorage.getItem("clerk-token");
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
      }
    }
  }
  return config;
});

export default api;

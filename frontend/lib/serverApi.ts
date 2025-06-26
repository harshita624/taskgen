// lib/serverApi.ts
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server"; // ✅ use this instead of getToken
import type { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse)  {
  const { userId, sessionId, getToken } = getAuth(req);
  const token = await getToken();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return api;
};

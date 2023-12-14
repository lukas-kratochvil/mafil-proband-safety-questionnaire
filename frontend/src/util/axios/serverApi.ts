import axios from "axios";
import { transformDateStringToDate } from "./axios-transformers";

/**
 * SERVER instance
 */
export const serverApi = axios.create({
  // 'server-api' URL is rewritten in the Nginx conf to the correct URL
  baseURL: import.meta.env.PROD ? "server-api" : `${import.meta.env.VITE_SERVER_URL}/graphql`,
  headers: {
    "Content-Type": "application/json",
    // API-KEY header is set in the Nginx conf for all the environments except the local development environment
    "API-KEY": import.meta.env.PROD ? undefined : import.meta.env.VITE_WEB_API_KEY,
  },
});

// Transform all date-strings in the response into Date objects
serverApi.interceptors.response.use(transformDateStringToDate);

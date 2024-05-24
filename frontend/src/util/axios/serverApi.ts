import axios from "axios";
import { transformResponseDateStringToDate } from "./transformers/dates-transformers";

/**
 * SERVER instance
 */
export const serverApi = axios.create({
  // 'server-api' URL is rewritten in the Nginx conf to the correct URL
  baseURL: import.meta.env.PROD ? "server-api" : `${import.meta.env.VITE_SERVER_URL}/graphql`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // REG-API-KEY header is set in the Nginx conf for all the environments except the local development environment
    "REG-API-KEY": import.meta.env.PROD ? undefined : import.meta.env.VITE_REG_APP_API_KEY,
  },
});

// Transform all date-strings in the response into Date objects
serverApi.interceptors.response.use(transformResponseDateStringToDate);

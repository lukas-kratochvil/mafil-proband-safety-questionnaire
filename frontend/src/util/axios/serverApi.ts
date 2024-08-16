import axios from "axios";
import { getConfigDev } from "@app/config/config.dev";
import { setAuthorizationHeader } from "./interceptors/request/set-authorization";
import { transformDateStringsToDate } from "./interceptors/response/transform-dates";

/**
 * SERVER instance
 */
export const serverApi = axios.create({
  // 'server-api' URL is rewritten in the Nginx conf to the correct URL
  baseURL: import.meta.env.PROD ? "server-api" : getConfigDev().serverApiUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

serverApi.interceptors.request.use(setAuthorizationHeader);

serverApi.interceptors.response.use(transformDateStringsToDate);

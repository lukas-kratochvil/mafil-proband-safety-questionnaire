import axios from "axios";
import { getConfig } from "@app/config/config";
import { setAuthorizationHeader } from "./interceptors/request/set-authorization";
import { transformDateStringsToDate } from "./interceptors/response/transform-dates";

/**
 * MAFILDB instance
 */
export const mafildbApi = axios.create({
  // we do not communicate with MAFILDB API when developing locally due to the OIDC authentication that cannot be done
  baseURL: import.meta.env.PROD ? getConfig().mafildb.apiUrl : undefined,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

mafildbApi.interceptors.request.use(setAuthorizationHeader);

mafildbApi.interceptors.response.use(transformDateStringsToDate);

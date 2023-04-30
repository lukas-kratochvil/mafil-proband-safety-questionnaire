import axios from "axios";
import { transformDateStringToDate } from "./axios-transformers";
import { getAuthUser } from "./hooks/auth/auth-service";

/* SERVER instance */
const serverApi = axios.create({
  // 'server-api' URL is rewritten in the Nginx conf to the correct URL
  baseURL: import.meta.env.PROD ? "server-api" : `${import.meta.env.VITE_SERVER_URL}/graphql`,
  headers: {
    "Content-Type": "application/json",
    // SERVER-API-KEY header is set in the Nginx conf for other environments different from the local development
    "SERVER-API-KEY": import.meta.env.PROD ? undefined : import.meta.env.VITE_SERVER_API_KEY,
  },
});

serverApi.interceptors.response.use(transformDateStringToDate);

/* MAFILDB instance */
const mafildbApi = axios.create({
  // 'mafildb-api' URL is rewritten in the Nginx conf to the correct URL
  baseURL: import.meta.env.PROD ? "mafildb-api" : `${import.meta.env.VITE_MAFILDB_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

mafildbApi.interceptors.request.use(async (config) => {
  const authUser = await getAuthUser();
  if (authUser) {
    // set Authorization header to user's OIDC access_token, so the request to the MAFILDB API will proceed
    config.headers.Authorization = `Bearer ${authUser.access_token}`; // eslint-disable-line no-param-reassign
  }
  return config;
});
mafildbApi.interceptors.response.use(transformDateStringToDate);

/* Exported instances */
export default {
  serverApi,
  mafildbApi,
};

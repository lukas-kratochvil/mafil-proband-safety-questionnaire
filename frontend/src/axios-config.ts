import axios from "axios";
import { transformDateStringToDate } from "./axios-transformers";
import { AuthService } from "./hooks/auth/auth-service";

/**
 * SERVER instance
 */
const serverApi = axios.create({
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

/**
 * MAFILDB instance
 */
const mafildbApi = axios.create({
  // we do not communicate with MAFILDB API when developing locally due to the OIDC authentication that cannot be done
  // 'mafildb-api' URL is rewritten in the Nginx conf to the correct URL
  baseURL: import.meta.env.PROD ? "mafildb-api" : undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add OIDC Access token to a request
mafildbApi.interceptors.request.use(async (config) => {
  const authService = AuthService.getInstance();
  const authUser = await authService.getAuthUser();
  if (authUser) {
    // set user's OIDC access_token in the Authorization header, so that a request to the MAFILDB API will proceed
    config.headers.Authorization = `Bearer ${authUser.access_token}`; // eslint-disable-line no-param-reassign
  }
  return config;
});

// Transform all date-strings in the response into Date objects
mafildbApi.interceptors.response.use(transformDateStringToDate);

export default {
  serverApi,
  mafildbApi,
};

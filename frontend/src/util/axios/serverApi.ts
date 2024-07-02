import axios from "axios";
import { AuthService } from "@app/hooks/auth/auth-service";
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
  },
});

// Add OIDC Access token to a request
serverApi.interceptors.request.use(async (config) => {
  const authService = AuthService.getInstance();
  const authUser = await authService.getAuthUser();
  if (authUser) {
    // set user's OIDC access_token in the Authorization header, so that a request to our backend API will proceed
    config.headers.Authorization = `Bearer ${authUser.access_token}`; // eslint-disable-line no-param-reassign
  }
  return config;
});

// Transform all date-strings in the response into Date objects
serverApi.interceptors.response.use(transformResponseDateStringToDate);

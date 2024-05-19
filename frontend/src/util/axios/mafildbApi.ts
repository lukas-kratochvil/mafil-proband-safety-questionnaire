import axios from "axios";
import envVars from "@app/envVars";
import { AuthService } from "@app/hooks/auth/auth-service";
import { transformDateStringToDate } from "./transformers/datestring-transformer";

/**
 * MAFILDB instance
 */
export const mafildbApi = axios.create({
  // we do not communicate with MAFILDB API when developing locally due to the OIDC authentication that cannot be done
  baseURL: import.meta.env.PROD ? envVars.MAFILDB_API_URL : undefined,
  headers: {
    Accept: "application/json",
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

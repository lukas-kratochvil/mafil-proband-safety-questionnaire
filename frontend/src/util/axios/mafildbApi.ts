import axios from "axios";
import { getConfig } from "@app/config";
import { transformResponseDateStringToDate } from "./transformers/dates-transformers";

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

// Add OIDC Access token to a request
mafildbApi.interceptors.request.use(async (axiosConfig) => {
  if (import.meta.env.PROD) {
    const authService = (await import("@app/hooks/auth/auth-service")).AuthService.getInstance();
    const authUser = await authService.getAuthUser();
    if (authUser) {
      // set user's OIDC access_token in the Authorization header, so that a request to the MAFILDB API will proceed
      axiosConfig.headers.Authorization = `Bearer ${authUser.access_token}`; // eslint-disable-line no-param-reassign
    }
  }

  return axiosConfig;
});

// Transform all date-strings in the response into Date objects
mafildbApi.interceptors.response.use(transformResponseDateStringToDate);

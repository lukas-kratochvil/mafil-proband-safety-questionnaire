import axios from "axios";
import { getConfigDev } from "@app/config.dev";
import { transformResponseDateStringToDate } from "./transformers/dates-transformers";

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

// Add OIDC Access token to a request
serverApi.interceptors.request.use(async (axiosConfig) => {
  if (import.meta.env.PROD) {
    const authService = (await import("@app/hooks/auth/auth-service")).AuthService.getInstance();
    const authUser = await authService.getAuthUser();
    if (authUser) {
      // set user's OIDC access_token in the Authorization header, so that a request to our backend API will proceed
      axiosConfig.headers.Authorization = `Bearer ${authUser.access_token}`; // eslint-disable-line no-param-reassign
    }
  }

  return axiosConfig;
});

// Transform all date-strings in the response into Date objects
serverApi.interceptors.response.use(transformResponseDateStringToDate);

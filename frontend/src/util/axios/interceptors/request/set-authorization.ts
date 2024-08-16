import type { InternalAxiosRequestConfig } from "axios";

/**
 * Set user's OIDC access token in the `Authorization` header, so that the request will proceed.
 */
export const setAuthorizationHeader = async (axiosConfig: InternalAxiosRequestConfig) => {
  if (import.meta.env.PROD) {
    const authService = (await import("@app/hooks/auth/auth-service")).AuthService.getInstance();
    const authUser = await authService.getAuthUser();
    if (authUser) {
      // eslint-disable-next-line no-param-reassign
      axiosConfig.headers.Authorization = `Bearer ${authUser.access_token}`;
    }
  }

  return axiosConfig;
};

import { useState } from "react";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import type { Auth } from "../auth";

const SESSION_STORAGE_OPERATOR_KEY = "operator";

export const useAuthProviderDev = (): Auth => {
  const [operator, setOperator] = useState<Auth["operator"]>(() => {
    const storedOperator = window.sessionStorage.getItem(SESSION_STORAGE_OPERATOR_KEY);
    return storedOperator === null ? undefined : JSON.parse(storedOperator);
  });

  const logIn = async (): Promise<void> => window.location.assign(RoutingPath.OIDC_LOGIN);

  const logInCallback = async (): Promise<boolean> => {
    const validOperator = await authenticateOperator();
    window.sessionStorage.setItem(SESSION_STORAGE_OPERATOR_KEY, JSON.stringify(validOperator));
    setOperator(validOperator);
    return true;
  };

  const logOut = async (): Promise<void> => {
    window.sessionStorage.removeItem(SESSION_STORAGE_OPERATOR_KEY);
    setOperator(undefined);
    window.location.assign(RoutingPath.LOGOUT);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const logOutCallback = async (): Promise<void> => {};

  const clearAuth = async (): Promise<void> => {
    window.sessionStorage.removeItem(SESSION_STORAGE_OPERATOR_KEY);
    setOperator(undefined);
  };

  return { logIn, logInCallback, logOut, logOutCallback, operator, clearAuth };
};

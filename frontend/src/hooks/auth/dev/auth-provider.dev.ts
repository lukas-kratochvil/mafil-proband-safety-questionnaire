import { useState } from "react";
import { getConfigDev } from "@app/config/config.dev";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import type { OperatorAuthInput } from "@app/util/server_API/dto";
import type { Auth } from "../auth";

const SESSION_STORAGE_OPERATOR_KEY = "operator";
const DEV_OPERATOR: OperatorAuthInput = { ...getConfigDev().operator };

export const useAuthProviderDev = (): Auth => {
  const [operator, setOperator] = useState<Auth["operator"]>(() => {
    const storedOperator = window.sessionStorage.getItem(SESSION_STORAGE_OPERATOR_KEY);
    return storedOperator === null ? undefined : JSON.parse(storedOperator);
  });

  const logIn = async (): Promise<void> => {
    try {
      const validOperator = await authenticateOperator(DEV_OPERATOR);
      setOperator(validOperator);
      window.sessionStorage.setItem(SESSION_STORAGE_OPERATOR_KEY, JSON.stringify(validOperator));
      window.location.assign(RoutingPath.WAITING_ROOM);
    } catch {
      setOperator(undefined);
    }
  };

  const logInCallback = async (): Promise<boolean> => true;

  const logOut = async (): Promise<void> => {
    setOperator(undefined);
    window.sessionStorage.removeItem(SESSION_STORAGE_OPERATOR_KEY);
    window.location.assign(RoutingPath.LOGOUT);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const logOutCallback = async (): Promise<void> => {};

  return { logIn, logInCallback, logOut, logOutCallback, operator };
};

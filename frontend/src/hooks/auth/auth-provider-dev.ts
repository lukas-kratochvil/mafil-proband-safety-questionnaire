import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOperatorAuthorization } from "@app/model/auth";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IAuth, Operator } from "./AuthProvider";

const SESSION_STORAGE_OPERATOR_KEY = "operator";
const DEV_OPERATOR: IOperatorAuthorization = {
  name: "Jiří",
  surname: "Svoboda",
  username: "987654",
  email: "987654@muni.cz",
};

export const useAuthProviderDev = (): IAuth => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<Operator>(() => {
    const storedOperator = window.sessionStorage.getItem(SESSION_STORAGE_OPERATOR_KEY);
    return storedOperator === null ? undefined : JSON.parse(storedOperator);
  });

  const logIn = async (): Promise<void> => {
    try {
      const validOperator = await authenticateOperator(DEV_OPERATOR);
      setOperator(validOperator);
      window.sessionStorage.setItem(SESSION_STORAGE_OPERATOR_KEY, JSON.stringify(validOperator));
      navigate(RoutingPath.WAITING_ROOM);
    } catch {
      setOperator(undefined);
    }
  };

  const logInCallback = async (): Promise<boolean> => true;

  const logOut = async (): Promise<void> => {
    setOperator(undefined);
    window.sessionStorage.removeItem(SESSION_STORAGE_OPERATOR_KEY);
    navigate(RoutingPath.LOGIN);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const logOutCallback = async (): Promise<void> => {};

  return { logIn, logInCallback, logOut, logOutCallback, operator };
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IOperatorAuthInput } from "@app/util/server_API/dto";
import { IAuth, Operator } from "./AuthProvider";

const SESSION_STORAGE_OPERATOR_KEY = "operator";
const DEV_OPERATOR: IOperatorAuthInput = {
  name: import.meta.env.VITE_OPERATOR_FIRSTNAME,
  surname: import.meta.env.VITE_OPERATOR_SURNAME,
  username: import.meta.env.VITE_OPERATOR_USERNAME,
  email: import.meta.env.VITE_OPERATOR_EMAIL,
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IAuth, Operator } from "./AuthProvider";

const SESSION_STORAGE_OPERATOR_KEY = "operator";

export const useAuthProviderDev = (): IAuth => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<Operator>(() => {
    const storedOperator = window.sessionStorage.getItem(SESSION_STORAGE_OPERATOR_KEY);
    return storedOperator === null ? undefined : JSON.parse(storedOperator);
  });

  const logIn = async (): Promise<void> => {
    try {
      const validOperator = await authenticateOperator({
        name: "Jiří",
        surname: "Svoboda",
        uco: "987654",
        email: "987654@muni.cz",
      });
      setOperator(validOperator);
      window.sessionStorage.setItem(SESSION_STORAGE_OPERATOR_KEY, JSON.stringify(validOperator));
      navigate(RoutingPath.WAITING_ROOM);
    } catch {
      setOperator(undefined);
    }
  };

  const logOut = async (): Promise<void> => {
    setOperator(undefined);
    window.sessionStorage.removeItem(SESSION_STORAGE_OPERATOR_KEY);
    navigate(RoutingPath.LOGIN);
  };

  return { logIn, logOut, operator };
};

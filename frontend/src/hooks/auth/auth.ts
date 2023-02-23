import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { operatorMR, operatorSpecial } from "@app/data/operator_data";
import { IAuth, IAuthGateOperator, IAuthMethod, IOperator } from "@app/interfaces/auth";
import { RoutingPaths } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/fetch";

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
export const authContext = createContext<IAuth>({} as IAuth);

export const useAuthProvider = (): IAuth => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<IOperator | undefined>(() => {
    const storedOperator = window.sessionStorage.getItem("operator");
    return storedOperator === null ? undefined : JSON.parse(storedOperator);
  });

  const logIn = async (authMethod: IAuthMethod) => {
    let loggingOperator: IAuthGateOperator;

    switch (authMethod) {
      case IAuthMethod.MUNI:
        // TODO: call the actual MUNI authentication gate
        loggingOperator = { ...operatorMR };
        break;
      case IAuthMethod.MUNI_HIGHER_PERMISSION:
        // TODO: delete this case - only for test pruposes
        loggingOperator = { ...operatorSpecial };
        break;
      default:
        throw new Error(`'${IAuthMethod[authMethod]}' authentication method is not implemented!`);
    }

    const fetchedOperator = await authenticateOperator(loggingOperator);

    if (fetchedOperator === undefined) {
      return false;
    }

    if (fetchedOperator !== undefined) {
      setOperator(fetchedOperator);
      window.sessionStorage.setItem("operator", JSON.stringify(fetchedOperator));
    }

    navigate(RoutingPaths.WAITING_ROOM);
    return true;
  };

  const logOut = () => {
    setOperator(undefined);
    window.sessionStorage.removeItem("operator");
    navigate(RoutingPaths.AUTH);
  };

  return {
    operator,
    logIn,
    logOut,
  };
};

export const useAuth = () => useContext(authContext);

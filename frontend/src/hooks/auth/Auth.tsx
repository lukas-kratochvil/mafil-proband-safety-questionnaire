import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../../App";
import { operatorMR, operatorSpecial } from "../../data/operator_data";
import { authenticateOperator } from "../../util/fetch";

export enum IAuthMethod {
  MUNI,
  MUNI_HIGHER_PERMISSION, // TODO: delete - only for test purposes
}

export interface IOperator {
  name: string;
  surname: string;
  uco: string;
  email: string;
  hasHigherPermission: boolean;
}

export interface IAuthGateOperator {
  name: string;
  surname: string;
  uco: string;
  email: string;
}

interface IAuth {
  operator: IOperator | undefined;
  logIn: (authMethod: IAuthMethod) => Promise<boolean>;
  logOut: () => void;
}

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
const authContext = createContext<IAuth>({} as IAuth);

const useAuthProvider = (): IAuth => {
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

    navigate(UrlBasePaths.WAITING_ROOM);
    return true;
  };

  const logOut = () => {
    setOperator(undefined);
    window.sessionStorage.removeItem("operator");
    navigate(UrlBasePaths.AUTH);
  };

  return {
    operator,
    logIn,
    logOut,
  };
};

export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

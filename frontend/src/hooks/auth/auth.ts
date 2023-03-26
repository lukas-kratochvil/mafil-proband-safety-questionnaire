import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAuth, IAuthGateOperator, IAuthMethod } from "@app/model/auth";
import { RoutingPaths } from "@app/routing-paths";
import { IOperatorDTO } from "@app/util/server_API/dto";
import { authenticateOperator } from "@app/util/server_API/fetch";

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
export const authContext = createContext<IAuth>({} as IAuth);

export const useAuthProvider = (): IAuth => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<IOperatorDTO | undefined>(() => {
    const storedOperator = window.sessionStorage.getItem("operator");
    return storedOperator === null ? undefined : JSON.parse(storedOperator);
  });

  const logIn = async (authMethod: IAuthMethod) => {
    // TODO: call the actual MUNI authentication gate
    const loggingOperator: IAuthGateOperator = {
      name: "Operator",
      surname: authMethod === IAuthMethod.MUNI_HIGHER_PERMISSION ? "Special" : "MR",
      uco: authMethod === IAuthMethod.MUNI_HIGHER_PERMISSION ? "987654" : "123456",
      email: authMethod === IAuthMethod.MUNI_HIGHER_PERMISSION ? "987654@muni.cz" : "123456@muni.cz",
    };
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

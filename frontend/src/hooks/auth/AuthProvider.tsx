import { createContext, PropsWithChildren, useContext, useState } from "react";
import { IOperatorDTO } from "@app/util/server_API/dto";
import { completeSignIn, completeSignOut, signIn, signOut } from "./auth-service";

export type Operator = IOperatorDTO | undefined;

interface IAuth {
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  operator: Operator;
}

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
const authContext = createContext<IAuth>(undefined as unknown as IAuth);

const useAuthProvider = () => {
  const [operator, setOperator] = useState<IOperatorDTO>();

  const logIn = async (): Promise<void> => {
    // Initiate the sign-in process
    await signIn();
    // Complete the sign-in process
    const validOperator = await completeSignIn();

    if (validOperator) {
      setOperator(validOperator);
      return;
    }

    setOperator(undefined);
  };

  const logOut = async (): Promise<void> => {
    // Initiate the sign-out process
    await signOut();
    // Complete the sign-out process
    await completeSignOut();
    setOperator(undefined);
  };

  return { logIn, logOut, operator };
};

export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

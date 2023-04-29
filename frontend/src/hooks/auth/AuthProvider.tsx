import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { IOperatorDTO } from "@app/util/server_API/dto";
import { completeSignIn, signIn, signOut } from "./auth-service";

export type Operator = IOperatorDTO | undefined;

interface IAuth {
  logIn: () => Promise<void>;
  logOut: () => void;
  operator: Operator;
}

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
const authContext = createContext<IAuth>({} as IAuth);

export const useAuth = () => useContext(authContext);

const useAuthProvider = () => {
  const [operator, setOperator] = useState<IOperatorDTO>();

  useEffect(() => {
    const authenticate = async () => {
      const validOperator = await completeSignIn();

      if (validOperator) {
        setOperator(validOperator);
        return;
      }

      // TODO: what to do when the sign in is unsuccessful?
      setOperator(undefined);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    authenticate();
  }, []);

  const logIn = async (): Promise<void> => {
    await signIn();
  };

  const logOut = async (): Promise<void> => {
    await signOut();
  };

  return { logIn, logOut, operator };
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

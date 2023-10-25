import { createContext, PropsWithChildren, useContext } from "react";
import { IOperatorDTO } from "@app/util/server_API/dto";
import { useAuthProvider } from "./auth-provider";
import { useAuthProviderDev } from "./auth-provider-dev";

export type Operator = IOperatorDTO | undefined;

export interface IAuth {
  logIn: () => Promise<void>;
  logInCallback: () => Promise<boolean>;
  logOut: () => Promise<void>;
  logOutCallback: () => Promise<void>;
  operator: Operator;
}

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
const authContext = createContext<IAuth>(undefined as unknown as IAuth);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  // Ignoring the eslint React hook rule because the code is resolved during build
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth = import.meta.env.PROD ? useAuthProvider() : useAuthProviderDev();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);

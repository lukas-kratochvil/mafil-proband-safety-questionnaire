import { createContext, PropsWithChildren, useContext, useState } from "react";

export enum IAuthMethod {
  MUNI,
}

interface IAuth {
  username?: string;
  signIn: (authMethod: IAuthMethod) => void;
  signOut: () => void;
}

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
const authContext = createContext<IAuth>({} as IAuth);

const useAuthProvider = (): IAuth => {
  const [username, setUsername] = useState<string | undefined>(
    window.sessionStorage.getItem("authUsername") ?? undefined
  );

  const signIn = (authMethod: IAuthMethod) => {
    let newUsername;

    switch (authMethod) {
      case IAuthMethod.MUNI:
        // TODO: call the actual MUNI authentication gate
        newUsername = `${IAuthMethod[authMethod]}_operator`;
        break;
      default:
        throw new Error(`'${IAuthMethod[authMethod]}' authentication method is not implemented!`);
    }

    if (newUsername !== undefined) {
      setUsername(newUsername);
      window.sessionStorage.setItem("authUsername", newUsername);
    }
  };

  const signOut = () => {
    setUsername(undefined);
    window.sessionStorage.removeItem("authUsername");
  };

  return {
    username,
    signIn,
    signOut,
  };
};

export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

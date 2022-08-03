import { createContext, PropsWithChildren, useContext, useState } from "react";

interface IAuth {
  username?: string;
  signIn: () => void;
  signOut: () => void;
}

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
const authContext = createContext<IAuth>({} as IAuth);

const useAuthProvider = (): IAuth => {
  const [username, setUsername] = useState<string | undefined>();

  // TODO: call the actual MUNI authentication gate or the one selected
  function signIn() {
    setUsername("operator");
  }

  function signOut() {
    setUsername(undefined);
  }

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

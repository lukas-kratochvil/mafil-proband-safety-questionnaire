import { useState } from "react";
import { IAuth, Operator } from "./AuthProvider";
import { completeSignIn, completeSignOut, signIn, signOut } from "./auth-service";

export const useAuthProvider = (): IAuth => {
  const [operator, setOperator] = useState<Operator>();

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

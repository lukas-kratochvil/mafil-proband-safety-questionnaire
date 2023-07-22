import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutingPath } from "@app/routing-paths";
import { IAuth, Operator } from "./AuthProvider";
import { AuthService } from "./auth-service";

export const useAuthProvider = (): IAuth => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<Operator>();

  const logIn = async (): Promise<void> => {
    const authService = AuthService.getInstance();
    // Initiate the sign-in process
    await authService.signIn();
    // TODO: delete logging to the console
    console.log("Signed in!");
    // Complete the sign-in process
    const validOperator = await authService.completeSignIn();

    if (validOperator) {
      setOperator(validOperator);
      navigate(RoutingPath.WAITING_ROOM);
    }
  };

  const logOut = async (): Promise<void> => {
    const authService = AuthService.getInstance();
    // Initiate the sign-out process
    await authService.signOut();
    // Complete the sign-out process
    await authService.completeSignOut();
    setOperator(undefined);
  };

  return { logIn, logOut, operator };
};

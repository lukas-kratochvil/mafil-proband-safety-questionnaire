import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/AuthProvider";
import { RoutingPath } from "../routing-paths";

export const PrivateRoute = () => {
  const { operator } = useAuth();
  return operator ? <Outlet /> : <Navigate to={RoutingPath.LOGIN} />;
};

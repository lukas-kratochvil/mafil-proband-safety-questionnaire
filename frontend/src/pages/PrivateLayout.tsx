import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { RoutingPath } from "@app/routing-paths";

export const PrivateLayout = () => {
  const { operator } = useAuth();
  return operator ? <Outlet /> : <Navigate to={RoutingPath.LOGIN} />;
};

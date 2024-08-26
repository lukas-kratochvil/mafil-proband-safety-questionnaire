import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/auth";
import { RoutingPath } from "@app/routing-paths";

export const PrivateLayout = () => {
  const location = useLocation();
  const { operator } = useAuth();

  if (operator) {
    return location.pathname === RoutingPath.AUTH ? <Navigate to={RoutingPath.AUTH_HOME} /> : <Outlet />;
  }

  return (
    <Navigate
      to={RoutingPath.LOGIN}
      replace
    />
  );
};

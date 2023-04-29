import { LazyExoticComponent } from "react";
import { Route, RouteProps, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/AuthProvider";
import { RoutingPaths } from "../routing-paths";

interface IPrivateRouteProps {
  Page: LazyExoticComponent<() => JSX.Element>;
  routeProps: Omit<RouteProps, "element">;
}

export const PrivateRoute = ({ Page, routeProps }: IPrivateRouteProps) => {
  const navigate = useNavigate();
  const { operator } = useAuth();

  if (operator === undefined) {
    navigate(RoutingPaths.AUTH);
  }

  return (
    <Route
      {...routeProps}
      element={<Page />}
    />
  );
};

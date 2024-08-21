import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/auth/auth";
import { Layout } from "./layouts/Layout";
import { PrivateLayout } from "./layouts/PrivateLayout";
import { RoutingPath } from "./routing-paths";

const HomePage = lazy(() => import("@app/pages/HomePage"));
const LoginPage = lazy(() => import("@app/pages/LoginPage"));
const OidcAuthCallbackPage = lazy(() => import("@app/pages/OidcAuthCallbackPage"));
const ApprovalRoomFormPage = lazy(() => import("@app/pages/ApprovalRoomFormPage"));
const DuplicationFormPage = lazy(() => import("@app/pages/DuplicationFormPage"));
const PhantomFormPage = lazy(() => import("@app/pages/PhantomFormPage"));
const ProbandFormPage = lazy(() => import("@app/pages/ProbandFormPage"));
const WaitingRoomFormPage = lazy(() => import("@app/pages/WaitingRoomFormPage"));
const ApprovalRoomTablePage = lazy(() => import("@app/pages/ApprovalRoomTablePage"));
const RecentVisitsTablePage = lazy(() => import("@app/pages/RecentVisitsTablePage"));
const WaitingRoomTablePage = lazy(() => import("@app/pages/WaitingRoomTablePage"));
const VisitDetailPage = lazy(() => import("@app/pages/VisitDetailPage"));
const NotFoundPage = lazy(() => import("@app/pages/NotFoundPage"));

const App = () => {
  const { operator } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Navigate
              to={RoutingPath.PROBAND_FORM}
              replace
            />
          }
        />
        <Route
          path={RoutingPath.PROBAND_HOME}
          element={<HomePage />}
        />
        <Route
          path={RoutingPath.PROBAND_FORM}
          element={<ProbandFormPage />}
        />
        <Route
          path={RoutingPath.LOGIN}
          // an authenticated user will not be logged out when redirecting to '/login' (or after clicking (multiple times) on the browser's back button) and will remain in the authenticated part of the application
          element={
            operator ? (
              <Navigate
                to={RoutingPath.AUTH_HOME}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path={RoutingPath.OIDC_LOGIN}
          // an authenticated user will not be logged out when redirecting to '/oidc-login' and will remain in the authenticated part of the application
          element={
            operator ? (
              <Navigate
                to={RoutingPath.AUTH_HOME}
                replace
              />
            ) : (
              <OidcAuthCallbackPage />
            )
          }
        />
        <Route
          path={RoutingPath.LOGOUT}
          element={
            <Navigate
              to={RoutingPath.LOGIN}
              replace
            />
          }
        />
        <Route
          path={RoutingPath.AUTH}
          element={<PrivateLayout />}
        >
          <Route
            path={RoutingPath.PHANTOM_FORM}
            element={<PhantomFormPage />}
          />
          <Route
            path={RoutingPath.WAITING_ROOM}
            element={<WaitingRoomTablePage />}
          />
          <Route
            path={`${RoutingPath.WAITING_ROOM_FORM}/:id`}
            element={<WaitingRoomFormPage />}
          />
          <Route
            path={RoutingPath.APPROVAL_ROOM}
            element={<ApprovalRoomTablePage />}
          />
          <Route
            path={`${RoutingPath.APPROVAL_ROOM_FORM}/:id`}
            element={<ApprovalRoomFormPage />}
          />
          <Route
            path={RoutingPath.RECENT_VISITS}
            element={<RecentVisitsTablePage />}
          />
          <Route
            path={`${RoutingPath.RECENT_VISITS_DUPLICATE}/:id`}
            element={<DuplicationFormPage />}
          />
          <Route
            path={`${RoutingPath.RECENT_VISITS_VISIT}/:id`}
            element={<VisitDetailPage />}
          />
        </Route>
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
};

export default App;

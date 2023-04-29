import { CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageContainer } from "@app/pages/PageContainer";
import { RoutingPath } from "./routing-paths";
import { PrivateRoute } from "./util/PrivateRoute";

const HomePage = lazy(() => import("@app/pages/HomePage"));
const LoginPage = lazy(() => import("@app/pages/LoginPage"));
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

export const App = () => (
  <Suspense
    fallback={
      <PageContainer center>
        <CircularProgress />
      </PageContainer>
    }
  >
    <Routes>
      <Route
        path="/"
        element={<Navigate to={RoutingPath.PROBAND_FORM} />}
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
        element={<LoginPage />}
      />
      <PrivateRoute
        Page={PhantomFormPage}
        routeProps={{ path: RoutingPath.PHANTOM_FORM }}
      />
      <PrivateRoute
        Page={WaitingRoomTablePage}
        routeProps={{ path: RoutingPath.WAITING_ROOM }}
      />
      <PrivateRoute
        Page={WaitingRoomFormPage}
        routeProps={{ path: `${RoutingPath.WAITING_ROOM}/form/:id` }}
      />
      <PrivateRoute
        Page={ApprovalRoomTablePage}
        routeProps={{ path: RoutingPath.APPROVAL_ROOM }}
      />
      <PrivateRoute
        Page={ApprovalRoomFormPage}
        routeProps={{ path: `${RoutingPath.APPROVAL_ROOM}/form/:id` }}
      />
      <PrivateRoute
        Page={RecentVisitsTablePage}
        routeProps={{ path: RoutingPath.RECENT_VISITS }}
      />
      <PrivateRoute
        Page={DuplicationFormPage}
        routeProps={{ path: `${RoutingPath.RECENT_VISITS}/duplicate/:id` }}
      />
      <PrivateRoute
        Page={VisitDetailPage}
        routeProps={{ path: `${RoutingPath.RECENT_VISITS}/visit/:id` }}
      />
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  </Suspense>
);

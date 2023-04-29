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
      <Route
        path={RoutingPath.AUTH}
        element={<PrivateRoute />}
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
          path={`${RoutingPath.WAITING_ROOM}/form/:id`}
          element={<WaitingRoomFormPage />}
        />
        <Route
          path={RoutingPath.APPROVAL_ROOM}
          element={<ApprovalRoomTablePage />}
        />
        <Route
          path={`${RoutingPath.APPROVAL_ROOM}/form/:id`}
          element={<ApprovalRoomFormPage />}
        />
        <Route
          path={RoutingPath.RECENT_VISITS}
          element={<RecentVisitsTablePage />}
        />
        <Route
          path={`${RoutingPath.RECENT_VISITS}/duplicate/:id`}
          element={<DuplicationFormPage />}
        />
        <Route
          path={`${RoutingPath.RECENT_VISITS}/visit/:id`}
          element={<VisitDetailPage />}
        />
      </Route>
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  </Suspense>
);

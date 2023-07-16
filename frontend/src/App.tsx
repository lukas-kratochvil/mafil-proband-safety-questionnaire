import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./pages/PrivateLayout";
import { SuspensePage } from "./pages/SuspensePage";
import { RoutingPath } from "./routing-paths";

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
  <Suspense fallback={<SuspensePage />}>
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
        path={RoutingPath.OIDC_LOGIN}
        element={<Navigate to={RoutingPath.WAITING_ROOM} />}
      />
      <Route
        path={RoutingPath.LOGOUT}
        element={<Navigate to={RoutingPath.LOGIN} />}
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
    </Routes>
  </Suspense>
);

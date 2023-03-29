import { CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/auth";
import { PageContainer } from "@app/pages/PageContainer";
import { RoutingPaths } from "./routing-paths";

const HomePage = lazy(() => import("@app/pages/HomePage"));
const LoginPage = lazy(() => import("@app/pages/LoginPage"));
const ApprovalFormPage = lazy(() => import("@app/pages/ApprovalFormPage"));
const DuplicationFormPage = lazy(() => import("@app/pages/DuplicationFormPage"));
const PhantomFormPage = lazy(() => import("@app/pages/PhantomFormPage"));
const ProbandFormPage = lazy(() => import("@app/pages/ProbandFormPage"));
const WaitingRoomFormPage = lazy(() => import("@app/pages/WaitingRoomFormPage"));
const ApprovalRoomTablePage = lazy(() => import("@app/pages/ApprovalRoomTablePage"));
const RecentVisitsTablePage = lazy(() => import("@app/pages/RecentVisitsTablePage"));
const WaitingRoomTablePage = lazy(() => import("@app/pages/WaitingRoomTablePage"));
const VisitDetailPage = lazy(() => import("@app/pages/VisitDetailPage"));
const NotFoundPage = lazy(() => import("@app/pages/NotFoundPage"));

export const App = () => {
  const { operator } = useAuth();

  return (
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
          element={<Navigate to={RoutingPaths.PROBAND_FORM} />}
        />
        <Route
          path={RoutingPaths.PROBAND_HOME}
          element={<HomePage />}
        />
        <Route
          path={RoutingPaths.PROBAND_FORM}
          element={<ProbandFormPage />}
        />
        <Route
          path={RoutingPaths.AUTH}
          element={<LoginPage />}
        />
        {operator && (
          <>
            <Route
              path={RoutingPaths.PHANTOM_FORM}
              element={<PhantomFormPage />}
            />
            <Route
              path={RoutingPaths.WAITING_ROOM}
              element={<WaitingRoomTablePage />}
            />
            <Route
              path={`${RoutingPaths.WAITING_ROOM}/form/:id`}
              element={<WaitingRoomFormPage />}
            />
            <Route
              path={RoutingPaths.APPROVAL_ROOM}
              element={<ApprovalRoomTablePage />}
            />
            <Route
              path={`${RoutingPaths.APPROVAL_ROOM}/form/:id`}
              element={<ApprovalFormPage />}
            />
            <Route
              path={RoutingPaths.RECENT_VISITS}
              element={<RecentVisitsTablePage />}
            />
            <Route
              path={`${RoutingPaths.RECENT_VISITS}/duplicate/:id`}
              element={<DuplicationFormPage />}
            />
            <Route
              path={`${RoutingPaths.RECENT_VISITS}/visit/:id`}
              element={<VisitDetailPage />}
            />
          </>
        )}
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </Suspense>
  );
};

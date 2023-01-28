import { CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@hooks/auth/auth";
import { PageContainer } from "@pages/PageContainer";
import { RoutingPaths } from "./routing-paths";

const HomePage = lazy(() => import("@pages/HomePage"));
const LoginPage = lazy(() => import("@pages/LoginPage"));
const ApprovalFormPage = lazy(() => import("@pages/ApprovalFormPage"));
const DuplicationFormPage = lazy(() => import("@pages/DuplicationFormPage"));
const PhantomFormPage = lazy(() => import("@pages/PhantomFormPage"));
const ProbandFormPage = lazy(() => import("@pages/ProbandFormPage"));
const WaitingRoomFormPage = lazy(() => import("@pages/WaitingRoomFormPage"));
const ApprovalRoomTablePage = lazy(() => import("@pages/ApprovalRoomTablePage"));
const RecentVisitsTablePage = lazy(() => import("@pages/RecentVisitsTablePage"));
const WaitingRoomTablePage = lazy(() => import("@pages/WaitingRoomTablePage"));
const VisitDetailPage = lazy(() => import("@pages/VisitDetailPage"));

export const App = () => {
  const { operator } = useAuth();

  return (
    <Suspense
      fallback={
        <PageContainer centerize>
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
              path={`${RoutingPaths.RECENT_VISITS}/duplicate/:id`}
              element={<DuplicationFormPage />}
            />
            <Route
              path={RoutingPaths.RECENT_VISITS}
              element={<RecentVisitsTablePage />}
            />
            <Route
              path={`${RoutingPaths.RECENT_VISITS}/visit/:id`}
              element={<VisitDetailPage />}
            />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

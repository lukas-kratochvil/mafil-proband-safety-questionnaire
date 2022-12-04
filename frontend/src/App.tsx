import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "@components/header/Header";
import { useAuth } from "@hooks/auth/auth";
import { ApprovalFormPage } from "@pages/ApprovalFormPage";
import { ApprovalRoomTablePage } from "@pages/ApprovalRoomTablePage";
import { DuplicationFormPage } from "@pages/DuplicationFormPage";
import { HomePage } from "@pages/HomePage";
import { LoginPage } from "@pages/LoginPage";
import { PhantomFormPage } from "@pages/PhantomFormPage";
import { ProbandFormPage } from "@pages/ProbandFormPage";
import { RecentVisitsTablePage } from "@pages/RecentVisitsTablePage";
import { VisitDetailPage } from "@pages/VisitDetailPage";
import { WaitingRoomFormPage } from "@pages/WaitingRoomFormPage";
import { WaitingRoomTablePage } from "@pages/WaitingRoomTablePage";
import { RoutingPaths } from "./routing-paths";

export const App = () => {
  const { operator } = useAuth();

  return (
    <>
      <Header />
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
    </>
  );
};

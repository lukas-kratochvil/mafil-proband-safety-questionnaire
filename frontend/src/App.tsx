import { Navigate, Route, Routes } from "react-router-dom";
import { UserFormContext } from "./components/form/types/types";
import { useAuth } from "./hooks/auth/Auth";
import { ApprovalTablePage } from "./pages/ApprovalTablePage";
import { FormPage } from "./pages/FormPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RecentVisitsTablePage } from "./pages/RecentVisitsTablePage";
import { VisitDetailPage } from "./pages/VisitDetailPage";
import { WaitingRoomTablePage } from "./pages/WaitingRoomTablePage";

export const App = () => {
  const { operator } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/form" />}
      />
      <Route
        path="/home"
        element={<HomePage />}
      />
      <Route
        path="/form"
        element={<FormPage initialUserFormContext={UserFormContext.PROBAND_EDIT} />}
      />
      <Route
        path="/auth"
        element={<LoginPage />}
      />
      {operator && (
        <>
          <Route
            path="/auth/form"
            element={<FormPage initialUserFormContext={UserFormContext.OPERATOR_CHECK} />}
          />
          <Route
            path="/auth/waiting-room"
            element={<WaitingRoomTablePage />}
          />
          <Route
            path="/auth/approval"
            element={<ApprovalTablePage />}
          />
          <Route
            path="/auth/approval/form/:id"
            element={<FormPage initialUserFormContext={UserFormContext.OPERATOR_APPROVE_DISABLED} />}
          />
          <Route
            path="/auth/recent-visits"
            element={<RecentVisitsTablePage />}
          />
          <Route
            path="/auth/visit-detail/:id"
            element={<VisitDetailPage />}
          />
        </>
      )}
    </Routes>
  );
};

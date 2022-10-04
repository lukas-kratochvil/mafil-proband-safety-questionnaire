import { Navigate, Route, Routes } from "react-router-dom";
import { FormEditState } from "./components/form/types/types";
import { useAuth } from "./hooks/auth/Auth";
import { ApprovalTablePage } from "./pages/ApprovalTablePage";
import { FormAfterSubmission } from "./pages/FormAfterSubmission";
import { FormPage } from "./pages/FormPage";
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
        path="/form"
        element={<FormPage initialEditState={FormEditState.PROBAND_EDIT} />}
      />
      <Route
        path="/form-after-submission"
        element={<FormAfterSubmission />}
      />
      <Route
        path="/auth"
        element={<LoginPage />}
      />
      {operator && (
        <>
          <Route
            path="/auth/form/:id"
            element={<FormPage initialEditState={FormEditState.OPERATOR_CHECK} />}
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
            element={<FormPage initialEditState={FormEditState.OPERATOR_APPROVE_DISABLED} />}
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

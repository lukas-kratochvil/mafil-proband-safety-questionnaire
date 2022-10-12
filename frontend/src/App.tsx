import { Navigate, Route, Routes } from "react-router-dom";
import { UserFormContext } from "./components/form/types/types";
import { useAuth } from "./hooks/auth/Auth";
import { ApprovalTablePage } from "./pages/ApprovalTablePage";
import { FantomFormPage } from "./pages/form/FantomFormPage";
import { ProbandFormPage } from "./pages/form/ProbandFormPage";
import { WaitingRoomFormPage } from "./pages/form/WaitingRoomFormPage";
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
        element={<ProbandFormPage />}
      />
      <Route
        path="/auth"
        element={<LoginPage />}
      />
      {operator && (
        <>
          <Route
            path="/auth/fantom-form"
            element={<FantomFormPage />}
          />
          <Route
            path="/auth/waiting-room"
            element={<WaitingRoomTablePage />}
          />
          <Route
            path="/auth/waiting-room/form/:id"
            element={<WaitingRoomFormPage />}
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
            path="/auth/visit/:id"
            element={<VisitDetailPage />}
          />
        </>
      )}
    </Routes>
  );
};

import { Route, Routes } from "react-router-dom";
import { FormAfterSubmission } from "./pages/FormAfterSubmission";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";
import { RecentVisitsTablePage } from "./pages/RecentVisitsTablePage";
import { VisitDetailPage } from "./pages/VisitDetailPage";
import { WaitingRoomTablePage } from "./pages/WaitingRoomTablePage";

export const App = () => (
  <Routes>
    <Route
      path="/"
      element={<FormPage />}
    />
    <Route
      path="/form-after-submission"
      element={<FormAfterSubmission />}
    />
    <Route
      path="/auth"
      element={<LoginPage />}
    />
    <Route
      path="/auth/form/:id"
      element={<FormPage />}
    />
    <Route
      path="/auth/waiting-room"
      element={<WaitingRoomTablePage />}
    />
    <Route
      path="/auth/recent-visits"
      element={<RecentVisitsTablePage />}
    />
    <Route
      path="/auth/visit-detail/:id"
      element={<VisitDetailPage />}
    />
  </Routes>
);

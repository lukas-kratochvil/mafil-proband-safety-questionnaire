import { Route, Routes } from "react-router-dom";
import { FormAfterSubmission } from "./pages/FormAfterSubmission";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";
import { TablePage, TableType } from "./pages/TablePage";
import { VisitDetailPage } from "./pages/VisitDetailPage";

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
      element={<TablePage type={TableType.WAITING_ROOM} />}
    />
    <Route
      path="/auth/recent-visits"
      element={<TablePage type={TableType.RECENT_VISITS} />}
    />
    <Route
      path="/auth/visit-detail/:id"
      element={<VisitDetailPage />}
    />
  </Routes>
);

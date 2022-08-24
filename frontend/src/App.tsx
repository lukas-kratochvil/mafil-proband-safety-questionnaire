import { Route, Routes } from "react-router-dom";
import { TabPage } from "./pages/TabPage";
import { recentVisitsTableData, waitingRoomTableData } from "./data/tab_page_table_data";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";
import { FormAfterSubmission } from "./pages/FormAfterSubmission";
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
      element={<TabPage data={waitingRoomTableData} />}
    />
    <Route
      path="/auth/recent-visits"
      element={<TabPage data={recentVisitsTableData} />}
    />
    <Route
      path="/auth/visit-detail/:id"
      element={<VisitDetailPage />}
    />
  </Routes>
);

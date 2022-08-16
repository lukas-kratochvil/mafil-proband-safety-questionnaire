import { Route, Routes } from "react-router-dom";
import { TabPage } from "./pages/TabPage";
import { recentVisitsTableData, waitingRoomTableData } from "./data/tab_page_table_data";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";
import { FormAfterSubmission } from "./pages/FormAfterSubmission";
import { PDFPage } from "./pages/PDFPage";

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
      // TODO: actual path should be path="/auth/form/{id}"
      path="/auth/form"
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
      // TODO: actual path should be path="/auth/visit-pdf/{id}"
      path="/auth/visit-pdf"
      element={<PDFPage />}
    />
  </Routes>
);

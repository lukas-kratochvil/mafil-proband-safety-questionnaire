import { Route, Routes } from "react-router-dom";
import { TabPage } from "./pages/TabPage";
import { recentVisitsTableData, waitingRoomTableData } from "./data/tab_page_table_data";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";
import { FormAfterSubmission } from "./pages/FormAfterSubmission";

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
    {/* TODO: actual path should be path='/auth/form-recap/{id}' */}
    <Route
      path="/auth/form-recap"
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
  </Routes>
);

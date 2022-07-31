import { Route, Routes } from "react-router-dom";
import { TabPage } from "./pages/TabPage";
import { recentVisitsTableData, waitingRoomTableData } from "./data/tab_page_table_data";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";

export interface IAuth {
  username: string;
}

export const App = () => {
  const auth: IAuth = {
    username: "Username",
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<FormPage />}
      />
      <Route
        path="/auth"
        element={<LoginPage />}
      />
      {/* TODO: actual path should be path='/auth/form-recap/{id}' */}
      <Route
        path="/auth/form-recap"
        element={<FormPage auth={auth} />}
      />
      <Route
        path="/auth/waiting-room"
        element={
          <TabPage
            auth={auth}
            data={waitingRoomTableData}
          />
        }
      />
      <Route
        path="/auth/recent-visits"
        element={
          <TabPage
            auth={auth}
            data={recentVisitsTableData}
          />
        }
      />
    </Routes>
  );
};

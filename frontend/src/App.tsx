import { Route, Routes } from "react-router-dom";
import { FormTemplate } from "./components/form/FormTemplate";
import { LoginPage } from "./components/operator/login_page/LoginPage";
import { WaitingRoom } from "./components/operator/waiting_room/WaitingRoom";

export interface IAuth {
  username: string;
}

export const App = () => {
  const auth: IAuth = {
    username: "Username",
  };

  return (
    <Routes>
      <Route path='/' element={<FormTemplate />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path='/auth/form-recap' element={<FormTemplate auth={auth} />} />
      <Route path='/auth/waiting-room' element={<WaitingRoom  auth={auth} />} />
    </Routes>
  );
};

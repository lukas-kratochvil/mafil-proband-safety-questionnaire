import { Route, Routes } from "react-router-dom";
import { FormPage } from "./pages/FormPage";
import { LoginPage } from "./pages/LoginPage";
import { WaitingRoomPage } from "./pages/WaitingRoomPage";

export interface IAuth {
  username: string;
}

export const App = () => {
  const auth: IAuth = {
    username: "Username",
  };

  return (
    <Routes>
      <Route path='/' element={<FormPage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path='/auth/form-recap' element={<FormPage auth={auth} />} />
      <Route path='/auth/waiting-room' element={<WaitingRoomPage  auth={auth} />} />
    </Routes>
  );
};

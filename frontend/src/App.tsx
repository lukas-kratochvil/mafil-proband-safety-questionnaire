import { Route, Routes } from "react-router-dom";
import { FormTemplate } from "./components/form/FormTemplate";
import { LoginPage } from "./components/operator/loginPage/LoginPage";

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
      <Route path='/auth/form-recap' element={<FormTemplate auth={auth}/>} />
    </Routes>
  );
};

import { Route, Routes } from "react-router-dom";
import { FormTemplate } from "./components/proband/form/FormTemplate";

export interface IAuth {
  username: string;
  isEditing: boolean;
}

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<FormTemplate />} />
      <Route path='/auth/form-recap' element={<FormTemplate auth={{ username: "Username", isEditing: false }}/>} />
      <Route path='/auth/form-recap' element={<FormTemplate />} />
    </Routes>
  );
};

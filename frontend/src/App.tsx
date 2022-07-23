import { Route, Routes } from "react-router-dom";
import { FormTemplate } from "./components/proband/form/FormTemplate";

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<FormTemplate />} />
    </Routes>
  );
};

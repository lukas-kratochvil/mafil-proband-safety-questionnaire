import { Route, Routes } from "react-router-dom";
import { Navigation } from "./components/operator/navigation/Navigation";
import { WelcomePage } from "./components/proband/welcomePage/WelcomePage";

export const App = () => {
  return (
    <Routes>
      {/* <Navigation /> */}
      <Route path='/' element={<WelcomePage />} />
    </Routes>
  );
};

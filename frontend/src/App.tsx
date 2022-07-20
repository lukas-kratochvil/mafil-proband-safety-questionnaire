import { Route, Routes } from "react-router-dom";
import { Navigation } from "./components/operator/navigation/Navigation";
import { WelcomeCard } from "./components/proband/welcomeCard/WelcomeCard";

export const App = () => {
  return (
    <Routes>
      {/* <Navigation /> */}
      <Route path='/' element={<WelcomeCard />} />
    </Routes>
  );
};

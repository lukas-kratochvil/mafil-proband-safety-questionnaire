import { Header } from "./components/header/Header";
import { Navigation } from "./components/operator/navigation/Navigation";
import { WelcomeCard } from "./components/proband/welcomeCard/WelcomeCard";

export const App = () => {
  return (
    <>
      <Header />
      <Navigation />
      <WelcomeCard />
    </>
  );
};

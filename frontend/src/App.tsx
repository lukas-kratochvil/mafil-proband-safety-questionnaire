import { Header } from "./components/header/Header";
import { MainContainer } from "./components/MainContainer";
import { Navigation } from "./components/operator/navigation/Navigation";
import { WelcomeCard } from "./components/proband/welcomeCard/WelcomeCard";

export const App = () => {
  return (
    <>
      <Header />
      <Navigation />
      <MainContainer>
        <WelcomeCard />
      </MainContainer>
    </>
  );
};

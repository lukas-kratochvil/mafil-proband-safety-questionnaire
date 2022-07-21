import { Header } from "../../header/Header";
import { MainContainer } from "../../MainContainer";
import { FormHeader } from "./FormHeader"

export const FormTemplate = () => {
  return (
    <>
      <Header />
      <MainContainer>
        <FormHeader />
      </MainContainer>
    </>
  );
}

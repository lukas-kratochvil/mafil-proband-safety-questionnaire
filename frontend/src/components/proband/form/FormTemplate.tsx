import { Stack } from "@mui/material";
import { Header } from "../../header/Header";
import { FormEntryInfo } from "./FormEntryInfo";
import { FormHeader } from "./FormHeader"
import { FormProbandInfo } from "./FormProbandInfo";

export const FormTemplate = () => {
  return (
    <>
      <Header />
      <Stack
        spacing={3}
        sx={{
          marginTop: 3,
          marginX: '20%',
        }}
      >
        <FormHeader />
        <FormProbandInfo />
        <FormEntryInfo />
      </Stack>
    </>
  );
}

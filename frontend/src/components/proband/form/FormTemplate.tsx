import { Stack } from "@mui/material";
import { Header } from "../../header/Header";
import { FormEntryInfo } from "./FormEntryInfo";
import { FormHeader } from "./FormHeader"

export const FormTemplate = () => {
  return (
    <>
      <Header />
      <Stack
        sx={{
          marginTop: 3,
          marginX: '20%',
        }}
      >
        <FormHeader />
        <FormEntryInfo />
      </Stack>
    </>
  );
}

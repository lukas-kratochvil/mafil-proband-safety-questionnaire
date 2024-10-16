import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FormCardContainer } from "./FormCardContainer";

type FormProbandContactCheckboxProps = {
  setIsContactsRequestShown: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormProbandContactCheckbox = ({ setIsContactsRequestShown }: FormProbandContactCheckboxProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "form.probandContactCheckbox" });

  return (
    <FormCardContainer title={t("title")}>
      <FormControlLabel
        label={t("label")}
        control={<Checkbox onChange={(e) => setIsContactsRequestShown(e.target.checked)} />}
      />
    </FormCardContainer>
  );
};

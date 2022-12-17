import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormCardContainer } from "./FormCardContainer";

interface IFormProbandContactCheckboxProps {
  setIsContactsRequestShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormProbandContactCheckbox = ({ setIsContactsRequestShown }: IFormProbandContactCheckboxProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandContactCheckbox" });

  return (
    <FormCardContainer title={t("title")}>
      <FormControlLabel
        label={t("label")}
        control={<Checkbox onChange={(e) => setIsContactsRequestShown(e.target.checked)} />}
      />
    </FormCardContainer>
  );
};

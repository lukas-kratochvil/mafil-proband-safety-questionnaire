import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { FormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { loadFormDefaultValuesVisitDuplication } from "@app/components/form/util/loaders";
import { useAuth } from "@app/hooks/auth/auth";
import type { FormPropType, ValidatedOperatorFormData } from "@app/model/form";
import { fetchDuplicatedPhantomVisit } from "@app/util/mafildb_API/calls";
import { getValidatedOperatorFormData } from "../util/utils";
import { FormContainer } from "./FormContainer";
import { getPhantomFormButtons } from "./PhantomForm";

export const PhantomDuplicationForm = () => {
  const { id } = useParams();
  const {
    data: duplicatedVisit,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["visit", id],
    queryFn: () => (id === undefined ? undefined : fetchDuplicatedPhantomVisit(id)),
    staleTime: Infinity,
  });
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { setValue } = useFormContext<FormPropType>();

  const [areDefaultValuesLoaded, setAreDefaultValuesLoaded] = useState<boolean>(false);
  const [formButtons, setFormButtons] = useState<FormButtonsProps<ValidatedOperatorFormData>>();

  // Setting default values
  useEffect(() => {
    if (duplicatedVisit) {
      const defaultValues = loadFormDefaultValuesVisitDuplication(duplicatedVisit);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });
      setAreDefaultValuesLoaded(true);
    }
  }, [duplicatedVisit, setValue]);

  // Setting form buttons
  useEffect(() => {
    if (operator) {
      setFormButtons(getPhantomFormButtons(navigate, operator));
    }
  }, [navigate, operator]);

  return (
    <FormContainer
      isLoading={isLoading || !areDefaultValuesLoaded}
      isError={isError}
      buttons={formButtons}
      getFormData={getValidatedOperatorFormData}
    >
      <FormProjectInfo isPhantom />
      <FormProbandInfo isPhantom />
    </FormContainer>
  );
};

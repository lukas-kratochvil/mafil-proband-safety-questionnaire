import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import { FormPropType } from "../../components/form/types/types";
import { loadEmptyDefaultValues } from "../../components/form/util/utils";
import { PageContainer } from "../PageContainer";

interface IFormPageTemplateProps {
  FormPage: () => JSX.Element;
  validationSchema: AnyObjectSchema;
  loadDefaultValues?: () => FormPropType;
}

export const FormPageTemplate = ({ FormPage, loadDefaultValues, validationSchema }: IFormPageTemplateProps) => {
  const formMethods = useForm<FormPropType>({
    mode: "onChange",
    defaultValues: loadDefaultValues === undefined ? loadEmptyDefaultValues() : loadDefaultValues(),
    resolver: yupResolver(validationSchema),
    // TODO: add this if the validation on onChange event is too slow:
    // reValidateMode: "onSubmit",
  });

  return (
    <PageContainer>
      <FormProvider {...formMethods}>
        <FormPage />
      </FormProvider>
    </PageContainer>
  );
};

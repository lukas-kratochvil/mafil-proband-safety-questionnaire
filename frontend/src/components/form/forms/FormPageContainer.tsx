import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import { loadEmptyDefaultValues } from "@components/form/util/loaders";
import { FormPropType } from "@interfaces/form";
import { PageContainer } from "@pages/PageContainer";

interface IFormPageContainerProps {
  FormPage: () => JSX.Element;
  validationSchema: AnyObjectSchema;
  loadDefaultValues?: () => FormPropType;
}

export const FormPageContainer = ({ FormPage, validationSchema, loadDefaultValues }: IFormPageContainerProps) => {
  const formMethods = useForm<FormPropType>({
    mode: "onChange",
    defaultValues: loadDefaultValues === undefined ? loadEmptyDefaultValues() : loadDefaultValues(),
    resolver: yupResolver(validationSchema),
    // Uncomment the line below if the validation on onChange event is too slow:
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

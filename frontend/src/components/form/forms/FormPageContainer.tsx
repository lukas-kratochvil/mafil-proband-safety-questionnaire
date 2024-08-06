import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import type { AnyObjectSchema } from "yup";
import type { FormPropType } from "@app/model/form";
import { PageContainer } from "@app/pages/PageContainer";

type FormPageContainerProps = {
  FormPage: () => JSX.Element;
  loadDefaultValues: () => FormPropType;
  validationSchema: AnyObjectSchema;
};

export const FormPageContainer = ({ FormPage, loadDefaultValues, validationSchema }: FormPageContainerProps) => {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: loadDefaultValues(),
    resolver: yupResolver(validationSchema),
  });

  return (
    <PageContainer>
      <FormProvider {...formMethods}>
        <FormPage />
      </FormProvider>
    </PageContainer>
  );
};

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import type { AnyObjectSchema } from "yup";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";
import type { FormPropType } from "@app/model/form";
import { PageContainer } from "@app/pages/PageContainer";

type FormPageContainerProps = {
  FormPage: () => JSX.Element;
  validationSchema: AnyObjectSchema;
  loadDefaultValues?: () => FormPropType;
};

export const FormPageContainer = ({ FormPage, validationSchema, loadDefaultValues }: FormPageContainerProps) => {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: loadDefaultValues === undefined ? loadEmptyDefaultValues() : loadDefaultValues(),
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

import { yupResolver } from "@hookform/resolvers/yup";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { AnyObjectSchema } from "yup";
import type { FormPropType } from "@app/model/form";
import { PageContainer } from "@app/pages/PageContainer";

type FormPageContainerProps = {
  loadDefaultValues: () => FormPropType;
  validationSchema: AnyObjectSchema;
};

export const FormPageContainer = ({
  children,
  loadDefaultValues,
  validationSchema,
}: PropsWithChildren<FormPageContainerProps>) => {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: loadDefaultValues(),
    resolver: yupResolver(validationSchema),
  });

  return (
    <PageContainer>
      <FormProvider {...formMethods}>{children}</FormProvider>
    </PageContainer>
  );
};

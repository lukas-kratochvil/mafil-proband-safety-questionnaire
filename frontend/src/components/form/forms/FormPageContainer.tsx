import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";
import { FormPropType } from "@app/model/form";
import { PageContainer } from "@app/pages/PageContainer";

interface IFormPageContainerProps {
  FormPage: () => JSX.Element;
  validationSchema: AnyObjectSchema;
  loadDefaultValues?: () => FormPropType;
}

// TODO: make this React component generic
export const FormPageContainer = ({ FormPage, validationSchema, loadDefaultValues }: IFormPageContainerProps) => {
  const formMethods = useForm<FormPropType>({
    mode: "onChange",
    defaultValues: loadDefaultValues === undefined ? loadEmptyDefaultValues() : loadDefaultValues(),
    // TODO: correctly infer the type of resolver's validation schema
    // @ts-expect-error ts(2322)
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

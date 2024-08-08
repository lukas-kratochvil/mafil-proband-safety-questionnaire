import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SanitizedHtml } from "@app/components/SanitizedHtml";
import type { LanguageCode } from "@app/i18n/i18n";
import { fetchExaminationConsent } from "@app/util/server_API/calls";
import { FormCardContainer } from "./FormCardContainer";

export const FormExaminationConsent = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["examinationConsent", i18n.language],
    queryFn: () => fetchExaminationConsent(i18n.language as LanguageCode),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <FormCardContainer title={data.title}>
      <SanitizedHtml html={data.html} />
    </FormCardContainer>
  );
};

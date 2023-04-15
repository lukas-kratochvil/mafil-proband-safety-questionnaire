import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { LanguageCode } from "@app/i18n";
import { fetchExaminationConsent } from "@app/util/server_API/fetch";
import { FormCardContainer } from "./FormCardContainer";

export const FormExaminationConsent = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["examinationConsent", i18n.language],
    queryFn: () => fetchExaminationConsent(i18n.language as LanguageCode),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <FormCardContainer title={data.title}>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.html) }} />
    </FormCardContainer>
  );
};

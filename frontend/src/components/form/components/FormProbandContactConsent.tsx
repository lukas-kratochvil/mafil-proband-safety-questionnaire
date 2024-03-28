import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { LanguageCode } from "@app/i18n/i18n";
import { sanitizeHtml } from "@app/util/htmlSanitization";
import { fetchProbandContactConsent } from "@app/util/server_API/calls";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContactConsent = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["probandContactConsent", i18n.language],
    queryFn: () => fetchProbandContactConsent(i18n.language as LanguageCode),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <FormCardContainer title={data.title}>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html) }} />
    </FormCardContainer>
  );
};

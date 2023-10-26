import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LanguageCode } from "@app/i18n";
import { sanitizeHtml } from "@app/util/htmlSanitization";
import { fetchBeforeExamination } from "@app/util/server_API/calls";
import { FormCardContainer } from "./FormCardContainer";

export const FormBeforeExamination = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["beforeExamination", i18n.language],
    queryFn: () => fetchBeforeExamination(i18n.language as LanguageCode),
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

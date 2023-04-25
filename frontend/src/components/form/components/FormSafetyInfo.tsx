import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { LanguageCode } from "@app/i18n";
import { fetchSafetyInfo } from "@app/util/server_API/calls";
import { FormCardContainer } from "./FormCardContainer";

export const FormSafetyInfo = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["safetyInfo", i18n.language],
    queryFn: () => fetchSafetyInfo(i18n.language as LanguageCode),
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

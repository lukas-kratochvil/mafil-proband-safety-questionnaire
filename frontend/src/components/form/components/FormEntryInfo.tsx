import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { LanguageCode } from "@app/i18n";
import { fetchEntryInfo } from "@app/util/server_API/calls";
import { FormCardContainer } from "./FormCardContainer";

export const FormEntryInfo = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["entryInfo", i18n.language],
    queryFn: () => fetchEntryInfo(i18n.language as LanguageCode),
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

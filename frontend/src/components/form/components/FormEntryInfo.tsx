import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SanitizedHtml } from "@app/components/SanitizedHtml";
import type { LanguageCode } from "@app/i18n/i18n";
import { fetchEntryInfo } from "@app/util/server_API/calls";
import { FormCardContainer } from "./FormCardContainer";

export const FormEntryInfo = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["entryInfo", i18n.language],
    queryFn: () => fetchEntryInfo(i18n.language as LanguageCode),
    staleTime: Infinity,
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

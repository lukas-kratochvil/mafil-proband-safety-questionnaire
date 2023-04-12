import { Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { LocalizationKeys, defaultNS } from "@app/i18n";
import { FormCardContainer } from "./FormCardContainer";
import { fetchBeforeExamination } from "@app/util/server_API/fetch";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";

export const FormBeforeExamination = () => {
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["beforeExamination", i18n.language],
    queryFn: () => fetchBeforeExamination(i18n.language as LocalizationKeys),
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

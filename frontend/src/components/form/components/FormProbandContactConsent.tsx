import { Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContactConsent = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandContactConsent" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography
        width="100%"
        textAlign="justify"
      >
        {t("text1")}
      </Typography>
      <Typography
        width="100%"
        textAlign="justify"
        paddingTop="1rem"
      >
        {t("text2")}
      </Typography>
      <Typography
        width="100%"
        textAlign="justify"
      >
        {t("text3")}
      </Typography>
      <Typography
        width="100%"
        textAlign="justify"
        paddingTop="1rem"
      >
        {t("text4")}
      </Typography>
      <Typography
        width="100%"
        textAlign="justify"
        paddingTop="1rem"
      >
        {t("list")}
      </Typography>
      <ul
        style={{
          margin: 0,
          textAlign: "justify",
        }}
      >
        <li>
          <Trans
            t={t}
            i18nKey="list-item1"
          >
            revoke the consent given at any time, without being threatened with any sanction, by sending an e-mail&nbsp;
            to the electronic address <span style={{ textDecoration: "underline" }}>mafil@ceitec.muni.cz</span>,
          </Trans>
        </li>
        <li>{t("list-item2")}</li>
        <li>{t("list-item3")}</li>
        <li>{t("list-item4")}</li>
        <li>
          <Trans
            t={t}
            i18nKey="list-item5"
          >
            file a complaint with the Office for the Protection of Personal Data Lt. Col. Sochora 27, 170 00&nbsp;
            Prague 7, mailbox ID: qkbaa2n, phone number +420 234 665 111, website&nbsp;
            <span style={{ textDecoration: "underline" }}>www.uoou.cz</span>, email address&nbsp;
            <span style={{ textDecoration: "underline" }}>posta@uoou.cz</span>.
          </Trans>
        </li>
      </ul>
      <Typography
        width="100%"
        textAlign="justify"
        paddingTop="1rem"
      >
        <Trans
          t={t}
          i18nKey="text5"
        >
          Contact for the personal data protection officer: Iva Zlatušková, telephone 54949 1030, e-mail&nbsp;
          <span style={{ textDecoration: "underline" }}>povenerec@muni.cz</span>.<br />
          Information on the&nbsp; processing of personal data at Masaryk University is available on the&nbsp; official
          board at
          <span style={{ textDecoration: "underline" }}>
            https://www.muni.cz/o-univerzite/uredni-deska/ochrana-osobnich-udaju
          </span>
          .<br />
          Information for data subjects to exercise their rights is available on the official board at&nbsp;
          <span style={{ textDecoration: "underline" }}>
            https://www.muni.cz/o-univerzite/uredni-deska/uplatneni-prav-subjektu-udaju
          </span>
          .
        </Trans>
      </Typography>
    </FormCardContainer>
  );
};

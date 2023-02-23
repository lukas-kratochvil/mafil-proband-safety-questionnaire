import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { Trans, useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { FormCardContainer } from "./FormCardContainer";

const Underline = ({ children }: PropsWithChildren) => <span style={{ textDecoration: "underline" }}>{children}</span>;

export const FormProbandContactConsent = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandContactConsent" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography>{t("text1")}</Typography>
      <Typography marginTop="1rem">{t("text2")}</Typography>
      <Typography>{t("text3")}</Typography>
      <Typography marginTop="1rem">{t("text4")}</Typography>
      <Typography marginTop="1rem">{t("list")}</Typography>
      <ul style={{ margin: 0 }}>
        <li>
          <Trans
            t={t}
            i18nKey="list-item1"
            defaults="revoke the consent given at any time, without being threatened with any sanction, by sending an e-mail to the electronic address <underline>{{email}}</underline>,"
            components={{ underline: <Underline /> }}
            values={{ email: "mafil@ceitec.muni.cz" }}
          />
        </li>
        <li>{t("list-item2")}</li>
        <li>{t("list-item3")}</li>
        <li>{t("list-item4")}</li>
        <li>
          <Trans
            t={t}
            i18nKey="list-item5"
            defaults="file a complaint with the Office for the Protection of Personal Data Lt. Col. Sochora 27, 170 00 Prague 7, mailbox ID: qkbaa2n, phone number +420 234 665 111, website <underline>{{email1}}</underline>, email address <underline>{{email2}}</underline>."
            components={{ underline: <Underline /> }}
            values={{
              email1: "www.uoou.cz",
              email2: "posta@uoou.cz",
            }}
          />
        </li>
      </ul>
      <Typography marginTop="1rem">
        <Trans
          t={t}
          i18nKey="text5"
          defaults="Contact for the personal data protection officer: Iva Zlatušková, telephone 54949 1030, e-mail <underline>{{email}}</underline>.<br />Information on the processing of personal data at Masaryk University is available on the official board at <underline>{{link1}}</underline>.<br />Information for data subjects to exercise their rights is available on the official board at <underline>{{link2}}</underline>."
          components={{ underline: <Underline /> }}
          values={{
            email: "poverenec@muni.cz",
            link1: "https://www.muni.cz/o-univerzite/uredni-deska/ochrana-osobnich-udaju",
            link2: "https://www.muni.cz/o-univerzite/uredni-deska/uplatneni-prav-subjektu-udaju",
          }}
        />
      </Typography>
    </FormCardContainer>
  );
};

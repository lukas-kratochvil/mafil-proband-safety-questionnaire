import { CZ, GB, SK } from "country-flag-icons/react/3x2";
import { ILanguageItemProps } from "./LanguageItem";

const languages: ILanguageItemProps[] = [
  {
    name: "Čeština",
    label: "CZ",
    Flag: CZ,
  },
  {
    name: "Slovenčina",
    label: "SK",
    Flag: SK,
  },
  {
    name: "English",
    label: "EN",
    Flag: GB,
  },
];

export default languages;

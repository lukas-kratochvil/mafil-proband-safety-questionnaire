import "react-i18next";
import type { defaultNS, resources } from "./i18n";

// Add custom types for our i18n translations
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["cs"];
  }
}

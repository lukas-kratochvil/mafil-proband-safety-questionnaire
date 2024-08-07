import type { defaultNS } from "./i18n";
import type Resources from "./resources";

// Add custom types for our i18n translations
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
  }
}

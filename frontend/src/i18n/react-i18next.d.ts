import type { defaultNS } from "./i18n";
import type Resources from "./resources";

// Add custom types for our i18n translations
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
  }
}

// ensures this file is a module (must contain `import` or `export`) and not a global-scoped script
export {};

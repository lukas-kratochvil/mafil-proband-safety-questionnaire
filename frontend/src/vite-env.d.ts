/// <reference types="vite/client" />

interface ImportMetaEnv {
  // used only in DEV environment
  readonly VITE_SERVER_URL: string;
  readonly VITE_REG_APP_API_KEY: string;
  readonly VITE_OPERATOR_FIRSTNAME: string;
  readonly VITE_OPERATOR_SURNAME: string;
  readonly VITE_OPERATOR_USERNAME: string;
  readonly VITE_OPERATOR_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

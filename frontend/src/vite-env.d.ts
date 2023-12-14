/// <reference types="vite/client" />

interface ImportMetaEnv {
  // used in PROD and DEV environment
  readonly VITE_APP_BAR_COLOR: string;

  // used only in PROD environment
  readonly VITE_JPM_CLIENT_ID: string;

  // used only in DEV environment
  readonly VITE_SERVER_URL: string;
  readonly VITE_WEB_API_KEY: string;
  readonly VITE_OPERATOR_FIRSTNAME: string;
  readonly VITE_OPERATOR_SURNAME: string;
  readonly VITE_OPERATOR_USERNAME: string;
  readonly VITE_OPERATOR_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

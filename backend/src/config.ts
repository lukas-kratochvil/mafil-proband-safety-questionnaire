type StringArrayToUnion<T extends ReadonlyArray<string>> = T[number];

export const ALLOWED_NODE_ENVS = ["development", "production"] as const;
type NodeEnv = StringArrayToUnion<typeof ALLOWED_NODE_ENVS>;

export const ALLOWED_PDF_LANGUAGE_CODES = ["cs", "en"] as const;
type PdfLanguageCode = StringArrayToUnion<typeof ALLOWED_PDF_LANGUAGE_CODES>;

export type EnvironmentVariables = {
  NODE_ENV: NodeEnv;
  TZ: number;
  PORT: number;
  DATABASE_URL: string;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  WEB_API_KEY: string;
  PDF_OPERATOR_LANGUAGE_CODE: PdfLanguageCode;
  WEB_URL: string;
};

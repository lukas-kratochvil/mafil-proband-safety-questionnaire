import Joi from "joi";

type StringArrayToUnion<T extends ReadonlyArray<string>> = T[number];

const ALLOWED_NODE_ENVS = ["development", "production"] as const;
type NodeEnv = StringArrayToUnion<typeof ALLOWED_NODE_ENVS>;

const ALLOWED_PDF_LANGUAGE_CODES = ["cs", "en"] as const;
type PdfLanguageCode = StringArrayToUnion<typeof ALLOWED_PDF_LANGUAGE_CODES>;

export type EnvironmentVariables = {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  throttleTtl: number;
  throttleLimit: number;
  pdfOperatorLanguageCode: PdfLanguageCode;
  webUrl: string;
  JPM_CLIENT_ID: string;
  JPM_CLIENT_SECRET: string;
  JPM_INTROSPECTION_ENDPOINT: string;
};

export const envVarsValidationSchema = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string()
    .trim()
    .valid(...ALLOWED_NODE_ENVS)
    .required(),
  PORT: Joi.number().integer().required(),
  DATABASE_URL: Joi.string().trim().required(),
  pdfOperatorLanguageCode: Joi.string()
    .trim()
    .valid(...ALLOWED_PDF_LANGUAGE_CODES)
    .required(),
  throttleTtl: Joi.number().integer().required(),
  throttleLimit: Joi.number().integer().required(),
  webUrl: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  JPM_CLIENT_ID: Joi.alternatives().conditional("NODE_ENV", { is: "production", then: Joi.string().trim().required() }),
  JPM_CLIENT_SECRET: Joi.alternatives().conditional("NODE_ENV", {
    is: "production",
    then: Joi.string().trim().required(),
  }),
  JPM_INTROSPECTION_ENDPOINT: Joi.alternatives().conditional("NODE_ENV", {
    is: "production",
    then: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .required(),
  }),
}).required();

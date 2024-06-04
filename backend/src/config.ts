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
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  ADMIN_API_KEY: string;
  WEB_API_KEY: string;
  PDF_OPERATOR_LANGUAGE_CODE: PdfLanguageCode;
  WEB_URL: string;
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
  ADMIN_API_KEY: Joi.string().trim().required(),
  WEB_API_KEY: Joi.string().trim().required(),
  PDF_OPERATOR_LANGUAGE_CODE: Joi.string()
    .trim()
    .valid(...ALLOWED_PDF_LANGUAGE_CODES)
    .required(),
  THROTTLE_TTL: Joi.number().integer().required(),
  THROTTLE_LIMIT: Joi.number().integer().required(),
  WEB_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  JPM_CLIENT_ID: Joi.string().trim().required(),
  JPM_CLIENT_SECRET: Joi.string().trim().required(),
  JPM_INTROSPECTION_ENDPOINT: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
}).required();

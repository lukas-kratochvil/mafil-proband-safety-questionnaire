import Joi from "joi";

type StringArrayToUnion<T extends ReadonlyArray<string>> = T[number];

const ALLOWED_NODE_ENVS = ["development", "production"] as const;
type NodeEnv = StringArrayToUnion<typeof ALLOWED_NODE_ENVS>;

const ALLOWED_PDF_LANGUAGE_CODES = ["cs", "en"] as const;
type PdfLanguageCode = StringArrayToUnion<typeof ALLOWED_PDF_LANGUAGE_CODES>;

export type EnvironmentVariables = {
  nodeEnv: NodeEnv;
  port: number;
  databaseUrl: string;
  throttle: {
    ttl: number;
    limit: number;
  };
  pdfOperatorLanguageCode: PdfLanguageCode;
  webUrl: string;
  jpmClientId: string;
  jpmClientSecret: string;
  jpmIntrospectionEndpoint: string;
};

export const configSchema = Joi.object<EnvironmentVariables>({
  nodeEnv: Joi.string()
    .trim()
    .valid(...ALLOWED_NODE_ENVS)
    .required(),
  port: Joi.number().integer().required(),
  databaseUrl: Joi.string().trim().required(),
  pdfOperatorLanguageCode: Joi.string()
    .trim()
    .valid(...ALLOWED_PDF_LANGUAGE_CODES)
    .required(),
  throttle: Joi.object({
    ttl: Joi.number().integer().required(),
    limit: Joi.number().integer().required(),
  }).required(),
  webUrl: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  jpmClientId: Joi.alternatives().conditional("nodeEnv", { is: "production", then: Joi.string().trim().required() }),
  jpmClientSecret: Joi.alternatives().conditional("nodeEnv", {
    is: "production",
    then: Joi.string().trim().required(),
  }),
  jpmIntrospectionEndpoint: Joi.alternatives().conditional("nodeEnv", {
    is: "production",
    then: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .required(),
  }),
}).required();

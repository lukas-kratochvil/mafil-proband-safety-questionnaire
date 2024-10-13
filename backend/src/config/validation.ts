import Joi from "joi";
import type { ArrayToUnion } from "@app/types";

const ALLOWED_NODE_ENVS = ["development", "production"] as const;
type NodeEnv = ArrayToUnion<typeof ALLOWED_NODE_ENVS>;

const ALLOWED_PDF_LANGUAGE_CODES = ["cs", "en"] as const;
type PdfLanguageCode = ArrayToUnion<typeof ALLOWED_PDF_LANGUAGE_CODES>;

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
  oidc: {
    jpm: {
      clientId: string;
      clientSecret: string;
      introspectionEndpoint: string;
    };
  };
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
  oidc: Joi.alternatives().conditional("nodeEnv", {
    is: "production",
    then: Joi.object({
      jpm: Joi.object({
        clientId: Joi.string().trim().required(),
        clientSecret: Joi.string().trim().required(),
        introspectionEndpoint: Joi.string()
          .uri({ scheme: ["http", "https"] })
          .required(),
      }).required(),
    }).required(),
  }),
}).required();

import type { Request } from "express";
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
  userContext: Required<Request["user"]>;
  oidc: {
    jpm: {
      clientId: string;
      clientSecret: string;
      introspectionEndpoint: string;
      userInfoEndpoint: string;
      allowedEdupersonEntitlements: string[];
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
  userContext: Joi.alternatives().conditional("nodeEnv", {
    is: "development",
    then: Joi.object({
      username: Joi.string().trim().required(),
      name: Joi.string().trim().required(),
      surname: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
    }).required(),
  }),
  oidc: Joi.alternatives().conditional("nodeEnv", {
    is: "production",
    then: Joi.object({
      jpm: Joi.object({
        clientId: Joi.string().trim().required(),
        clientSecret: Joi.string().trim().required(),
        introspectionEndpoint: Joi.string()
          .uri({ scheme: ["http", "https"] })
          .required(),
        userInfoEndpoint: Joi.string()
          .uri({ scheme: ["http", "https"] })
          .required(),
        allowedEdupersonEntitlements: Joi.array<string>().items(Joi.string().trim().required()).min(1).required(),
      }).required(),
    }).required(),
  }),
}).required();

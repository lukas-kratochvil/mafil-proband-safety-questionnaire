import { number, object, string, type InferType } from "yup";

const configSchema = object({
  appBarColor: string()
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "App bar color is not hexadecimal!")
    .required(),
  oidc: object({
    jpm: object({
      authorizationEndpoint: string().trim().url().required(),
      clientId: string().trim().required(),
      redirectUri: string().trim().url().required(),
      scopes: string()
        .trim()
        .matches(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/)
        .required(),
      mfaEndpoint: string().trim().url().required(),
      postLogoutRedirectUri: string().trim().url().required(),
    }).required(),
  }).required(),
  mafildb: object({
    apiUrl: string().trim().url().required(),
    visitsMaxDaysOld: number().positive().integer().required(),
  }).required(),
}).required();

type Config = InferType<typeof configSchema>;

const config = {};

export const loadConfig = async () => {
  const response = await fetch("/config.json");
  const data = await response.json();

  // validate the data
  await configSchema.validate(data);

  // if validation passes, assign the data to the config object
  Object.assign(config, data);
};

export default config as Config;

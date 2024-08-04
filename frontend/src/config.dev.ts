import { object, string, type InferType } from "yup";

const configDevSchema = object({
  serverApiUrl: string().trim().required(),
  operator: object({
    name: string().trim().required(),
    surname: string().trim().required(),
    username: string().trim().required(),
    email: string().trim().email().required(),
  }).required(),
}).required();

type ConfigDev = InferType<typeof configDevSchema>;

let configDev: ConfigDev;

export const loadConfigDev = async () => {
  const response = await fetch("/config.json");
  const data = await response.json();
  configDev = await configDevSchema.validate(data);
};

export const getConfigDev = (): ConfigDev => configDev;

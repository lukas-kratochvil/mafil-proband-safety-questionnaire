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

const configDev = {};

export const loadConfigDev = async () => {
  const response = await fetch("/config.local.json");
  const data = await response.json();

  // validate the data
  await configDevSchema.validate(data);

  // if validation passes, assign the data to the config object
  Object.assign(configDev, data);
};

export default configDev as ConfigDev;

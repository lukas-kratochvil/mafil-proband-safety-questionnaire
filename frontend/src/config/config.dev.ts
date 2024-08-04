import { object, string, type InferType } from "yup";
import load from "./loader";

const configDevSchema = object({
  serverApiUrl: string().trim().required(),
  operator: object({
    name: string().trim().required(),
    surname: string().trim().required(),
    username: string().trim().required(),
    email: string().trim().email().required(),
  }).required(),
}).required();

let configDev: InferType<typeof configDevSchema>;

export const loadConfigDev = async () => {
  configDev = await load(configDevSchema);
};

export const getConfigDev = () => configDev;

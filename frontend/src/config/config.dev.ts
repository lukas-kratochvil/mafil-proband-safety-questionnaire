import { object, string, type InferType } from "yup";
import load from "./loader";

const configDevSchema = object({
  serverApiUrl: string().trim().required(),
}).required();

let configDev: InferType<typeof configDevSchema>;

export const loadConfigDev = async () => {
  configDev = await load(configDevSchema);
};

export const getConfigDev = () => configDev;

import { readFileSync } from "fs";
import { load as loadYaml } from "js-yaml";
import { envVarsValidationSchema } from "./validation";

const load = () => {
  const configYaml = loadYaml(readFileSync("config.yaml", "utf8")) as Record<string, unknown>;
  const config = {
    ...configYaml,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
  };
  envVarsValidationSchema.validate(config, {
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: false,
    debug: process.env.NODE_ENV === "development",
  });
  return config;
};

export default load;

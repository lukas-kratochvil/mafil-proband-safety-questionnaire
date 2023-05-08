import fs from "fs";

type Secrets = {
  oidcClientId: string;
}

const secretsFile = fs.readFileSync("secrets.json", "utf8");
export const secrets = JSON.parse(secretsFile) as Secrets;

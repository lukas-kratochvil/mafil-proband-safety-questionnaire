type Secrets = {
  oidcClientId: string;
}

const secretsFile = await fetch("assets/secrets.json");
export const secrets = (await secretsFile.json()) as Secrets;

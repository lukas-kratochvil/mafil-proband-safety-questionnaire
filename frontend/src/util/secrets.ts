type Secrets = {
  oidcClientId: string;
}

let secrets: Secrets;

const fetchSecrets = async (): Promise<void> => {
  const secretsFile = await fetch("assets/secrets.json");
  secrets = (await secretsFile.json()) as Secrets;
}

fetchSecrets();

export { secrets };

type Secrets = {
  oidcClientId: string;
}

let secrets: Secrets;

const fetchSecrets = async (): Promise<void> => {
  const secretsFile = await fetch("secrets.json");
  secrets = (await secretsFile.json()) as Secrets;
}

fetchSecrets();

export { secrets };

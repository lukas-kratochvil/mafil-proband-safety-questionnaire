type Secrets = {
  oidcClientId: string;
};

let secrets: Secrets;

const fetchSecrets = async (): Promise<void> => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  const secretsFile = await fetch("assets/secrets.json", { headers });
  console.log("Secrets file:");
  console.log(secretsFile);
  secrets = (await secretsFile.json()) as Secrets;
};

fetchSecrets();

export { secrets };

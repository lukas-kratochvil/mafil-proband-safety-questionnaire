export enum IAuthMethodDev {
  MUNI,
  MUNI_HIGHER_PERMISSION,
}

export interface IOperatorAuthorization {
  name: string;
  surname: string;
  uco: string;
  email: string;
}

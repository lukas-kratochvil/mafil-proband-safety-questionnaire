export enum IAuthMethod {
  MUNI,
  MUNI_HIGHER_PERMISSION,
}

export interface IAuthGateOperator {
  name: string;
  surname: string;
  uco: string;
  email: string;
}

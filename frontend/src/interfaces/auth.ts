export enum IAuthMethod {
  MUNI,
  MUNI_HIGHER_PERMISSION,
}

export interface IOperator {
  id: string;
  name: string;
  surname: string;
  uco: string;
  email: string;
  hasHigherPermission: boolean;
}

export interface IAuthGateOperator {
  name: string;
  surname: string;
  uco: string;
  email: string;
}

export interface IAuth {
  operator: IOperator | undefined;
  logIn: (authMethod: IAuthMethod) => Promise<boolean>;
  logOut: () => void;
}

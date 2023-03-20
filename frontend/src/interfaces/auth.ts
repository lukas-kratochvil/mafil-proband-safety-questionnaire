import { IOperatorDTO } from "@app/util/server_API/dto";

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

export interface IAuth {
  operator: IOperatorDTO | undefined;
  logIn: (authMethod: IAuthMethod) => Promise<boolean>;
  logOut: () => void;
}

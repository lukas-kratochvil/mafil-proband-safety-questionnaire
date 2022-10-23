import { IOperator } from "../hooks/auth/Auth";

export const operatorSpecial: IOperator = {
  name: "Operator",
  surname: "Special",
  uco: "123456",
  email: "operator.special@gmail.com",
  hasHigherPermission: true,
};

export const operatorMR: IOperator = {
  name: "Operator",
  surname: "MR",
  uco: "987654",
  email: "operator.mr@gmail.com",
  hasHigherPermission: false,
};

export const trustedOperators = [operatorSpecial, operatorMR];

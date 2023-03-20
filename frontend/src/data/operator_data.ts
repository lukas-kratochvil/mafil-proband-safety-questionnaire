import { IOperator } from "@app/interfaces/auth";

export const operatorSpecial: IOperator = {
  id: "operator1",
  name: "Operator",
  surname: "Special",
  uco: "123456",
  email: "operator.special@gmail.com",
  hasHigherPermission: true,
};

export const operatorMR: IOperator = {
  id: "operatorSpec1",
  name: "Operator",
  surname: "MR",
  uco: "987654",
  email: "operator.mr@gmail.com",
  hasHigherPermission: false,
};

export const trustedOperators = [operatorSpecial, operatorMR];

import { IOperator } from "../hooks/auth/Auth";

const operator1: IOperator = {
  name: "Operator",
  surname: "Special",
  uco: "123456",
  email: "operator.special@gmail.com",
  hasHigherPermission: true,
};

const operator2: IOperator = {
  name: "Operator",
  surname: "MR",
  uco: "987654",
  email: "operator.mr@gmail.com",
  hasHigherPermission: false,
};

export const trustedOperators = [operator1, operator2];

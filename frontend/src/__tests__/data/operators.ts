import { IOperatorDTO } from "@app/util/server_API/dto";

export const operatorMRDev: IOperatorDTO = {
  id: "1",
  name: "Operator",
  surname: "MR",
  email: "operator.mr@mail.com",
  role: "MR",
  uco: "123456",
};

export const operatorMRHigPermDev: IOperatorDTO = {
  id: "2",
  name: "Operator",
  surname: "Special",
  email: "operator.special@mail.com",
  role: "MR_HIGH_PERM",
  uco: "987654",
};

import type { IOperatorDTO } from "@app/util/server_API/dto";

export const operatorMRTest: IOperatorDTO = {
  id: "1",
  name: "Operator",
  surname: "MR",
  email: "operator.mr@mail.com",
  role: "MR",
  username: "123456",
};

export const operatorMRHigPermTest: IOperatorDTO = {
  id: "2",
  name: "Operator",
  surname: "Special",
  email: "operator.special@mail.com",
  role: "MR_HIGH_PERM",
  username: "987654",
};

import type { OperatorDTO } from "@app/util/server_API/dto";

export const operatorMRTest: OperatorDTO = {
  id: "1",
  name: "Operator",
  surname: "MR",
  email: "operator.mr@mail.com",
  role: "MR",
  username: "123456",
};

export const operatorMRHigPermTest: OperatorDTO = {
  id: "2",
  name: "Operator",
  surname: "Special",
  email: "operator.special@mail.com",
  role: "MR_HIGH_PERM",
  username: "987654",
};

import type { GenderCode } from "../server_API/dto";
import type { MDB_GenderCode } from "./dto";

export const transformGenderCodeForMDB = (code: GenderCode): MDB_GenderCode => {
  switch (code) {
    case "M":
      return "m";
    case "F":
      return "f";
    default:
      return "o";
  }
};

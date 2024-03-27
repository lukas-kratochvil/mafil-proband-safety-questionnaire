import type { GenderCode, HandednessCode } from "../server_API/dto";
import type { MDB_GenderCode, MDB_HandednessCode } from "./dto";

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

export const transformHandednessCodeForMDB = (code: HandednessCode): MDB_HandednessCode => {
  switch (code) {
    case "RH":
      return "rh";
    case "LH":
      return "lh";
    case "FL":
      return "fl";
    default:
      return "un";
  }
};

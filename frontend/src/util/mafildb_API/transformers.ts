import { format } from "date-fns";
import type { GenderCode, HandednessCode } from "../server_API/dto";
import type { MDB_GenderCode, MDB_HandednessCode } from "./dto";

/**
 * Transform dates to MAFILDB format 'yyyy-MM-dd'.
 */
export const transformDateToMafildbFormat = (date: Date) => format(date, "yyyy-MM-dd");

/**
 * Transforms our gender code to match MDB gender values.
 */
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

/**
 * Transforms MDB gender code to match our gender values.
 */
export const transformMDBGenderCode = (code: MDB_GenderCode): GenderCode => {
  switch (code) {
    case "m":
      return "M";
    case "f":
      return "F";
    default:
      return "O";
  }
};

/**
 * Transforms our handedness code to match MDB handedness values.
 */
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

/**
 * Transforms MDB handedness code to match our handedness values.
 */
export const transformMDBHandednessCode = (code: MDB_HandednessCode): HandednessCode => {
  switch (code) {
    case "rh":
      return "RH";
    case "lh":
      return "LH";
    case "fl":
      return "FL";
    default:
      return "UN";
  }
};

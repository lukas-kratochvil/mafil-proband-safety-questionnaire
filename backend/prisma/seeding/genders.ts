export type GenderCode = "F" | "M" | "O";

interface IGender {
  code: GenderCode;
  csText: string;
  enText: string;
}

const genders: IGender[] = [
  {
    code: "M",
    csText: "Muž",
    enText: "Male",
  },
  {
    code: "F",
    csText: "Žena",
    enText: "Female",
  },
  {
    code: "O",
    csText: "Jiné",
    enText: "Other",
  },
];

export default genders;

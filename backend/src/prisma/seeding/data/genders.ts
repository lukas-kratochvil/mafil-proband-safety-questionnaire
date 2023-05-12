export type GenderCode = "F" | "M" | "O";

interface IGender {
  code: GenderCode;
  order: number;
  csText: string;
  enText: string;
}

const genders: Omit<IGender, "order">[] = [
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

const orderedGenders: IGender[] = genders.map((gender, i) => ({
  ...gender,
  order: i + 1,
}))

export default orderedGenders;

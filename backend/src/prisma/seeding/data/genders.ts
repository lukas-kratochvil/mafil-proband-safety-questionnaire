export type GenderCode = "F" | "M" | "O";

type Gender = {
  code: GenderCode;
  order: number;
  csText: string;
  enText: string;
};

const genders: Omit<Gender, "order">[] = [
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

const orderedGenders: Gender[] = genders.map((gender, i) => ({
  ...gender,
  order: i + 1,
}));

export default orderedGenders;

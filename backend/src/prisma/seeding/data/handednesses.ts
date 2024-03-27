type IHandedness = {
  code: string;
  order: number;
  csText: string;
  enText: string;
};

const handednesses: Omit<IHandedness, "order">[] = [
  {
    code: "RH",
    csText: "Pravák",
    enText: "Right-handed",
  },
  {
    code: "LH",
    csText: "Levák",
    enText: "Left-handed",
  },
  {
    code: "FL",
    csText: "Přeučený levák",
    enText: "Forced left-handed",
  },
  {
    code: "UN",
    csText: "Neurčeno",
    enText: "Undetermined",
  },
];

const orderedHandednesses: IHandedness[] = handednesses.map((handedness, i) => ({
  ...handedness,
  order: i + 1,
}));

export default orderedHandednesses;

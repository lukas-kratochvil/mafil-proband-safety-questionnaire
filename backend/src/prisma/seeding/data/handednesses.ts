interface IHandedness {
  code: string;
  order: number;
  csText: string;
  enText: string;
}

const handednesses: Omit<IHandedness, "order">[] = [
  {
    code: "R",
    csText: "Pravák",
    enText: "Right-handed",
  },
  {
    code: "L",
    csText: "Levák",
    enText: "Left-handed",
  },
  {
    code: "RL",
    csText: "Přeučený levák",
    enText: "Retrained left-handed",
  },
  {
    code: "U",
    csText: "Neurčeno",
    enText: "Undetermined",
  },
];

const orderedHandednesses: IHandedness[] = handednesses.map((handedness, i) => ({
  ...handedness,
  order: i + 1,
}));

export default orderedHandednesses;

interface IHandedness {
  code: string;
  order: number;
  csText: string;
  enText: string;
}

const handedness: Omit<IHandedness, "order">[] = [
  {
    code: "r",
    csText: "Pravák",
    enText: "Right-handed",
  },
  {
    code: "l",
    csText: "Levák",
    enText: "Left-handed",
  },
  {
    code: "rl",
    csText: "Přeučený levák",
    enText: "Retrained left-handed",
  },
  {
    code: "u",
    csText: "Neurčeno",
    enText: "Undetermined",
  },
];

const orderedHandednesses: IHandedness[] = handedness.map((handedness, i) => ({
  ...handedness,
  order: i + 1,
}))

export default orderedHandednesses;

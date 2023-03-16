interface IHandedness {
  code: string;
  csText: string;
  enText: string;
}

const handedness: IHandedness[] = [
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

export default handedness;

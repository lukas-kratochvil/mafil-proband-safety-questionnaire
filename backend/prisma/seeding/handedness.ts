interface IHandedness {
  csText: string;
  enText: string;
}

const handedness: IHandedness[] = [
  {
    csText: "Pravák",
    enText: "Right-handed",
  },
  {
    csText: "Levák",
    enText: "Left-handed",
  },
  {
    csText: "Přeučený levák",
    enText: "Retrained left-handed",
  },
  {
    csText: "Neurčeno",
    enText: "Undetermined",
  },
];

export default handedness;

import type { StrictOmit } from "@app/types";

type Handedness = {
  code: string;
  order: number;
  csText: string;
  enText: string;
};

const handednesses: StrictOmit<Handedness, "order">[] = [
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

const orderedHandednesses: Handedness[] = handednesses.map((handedness, i) => ({
  ...handedness,
  order: i + 1,
}));

export default orderedHandednesses;

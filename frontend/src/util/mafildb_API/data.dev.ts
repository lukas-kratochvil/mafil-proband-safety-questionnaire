import { IDeviceDTO, IProjectDTO, IVisitDTO, VisitState } from "@app/util/mafildb_API/dto";

export const projectsDev: IProjectDTO[] = [
  {
    id: "1",
    name: "Projekt 1",
    acronym: "P1",
  },
  {
    id: "2",
    name: "Projekt 2",
    acronym: "P2",
  },
  {
    id: "3",
    name: "Projekt 3",
    acronym: "P3",
  },
];

export const devicesDev: IDeviceDTO[] = [
  {
    id: "1",
    name: "Magnet 1",
  },
  {
    id: "2",
    name: "Magnet 2",
  },
];

const idCounter = {
  freeId: "1",
};

export const generateVisitId = (): string => {
  const id = idCounter.freeId;
  idCounter.freeId = `${+id + 1}`;
  return id;
};

const createDummyVisits = (initialVisit: IVisitDTO, state: VisitState, count: number): IVisitDTO[] => {
  const visits: IVisitDTO[] = [];

  for (let i = 0; i < count; i++) {
    visits.push({
      ...initialVisit,
      visit_name: generateVisitId(),
      state,
      is_phantom: state === VisitState.PHANTOM_DONE,
      project_id: projectsDev[i % 2].id,
      device_id: devicesDev[i % 2].id,
    });
  }

  return visits;
};

const initialDummyVisit: IVisitDTO = {
  date: new Date(1663390000000),
  visit_name: generateVisitId(),
  state: VisitState.APPROVED,
  is_phantom: false,
  proband_language_code: "cs",
  project_id: projectsDev[0].id,
  device_id: devicesDev[0].id,
  measurement_date: new Date(),
  finalizer_uco: "123456",
  name: "Karel",
  surname: "Novák",
  personal_id: "123456789",
  birthdate: new Date(),
  height_cm: 180,
  weight_kg: 85,
  gender_code: "M",
  native_language_code: "cs",
  visual_correction_dioptre: 0,
  handedness_code: "r",
  email: "karel.novak@email.cz",
  phone: "123456789",
  answers: [],
};

export const dummyVisits: IVisitDTO[] = [
  initialDummyVisit,
  ...createDummyVisits(initialDummyVisit, VisitState.DISAPPROVED, 2),
  ...createDummyVisits(initialDummyVisit, VisitState.APPROVED, 2),
  ...createDummyVisits(initialDummyVisit, VisitState.FOR_SIGNATURE_PHYSICALLY, 2),
  ...createDummyVisits(initialDummyVisit, VisitState.PHANTOM_DONE, 2),
  ...createDummyVisits(initialDummyVisit, VisitState.SIGNED_PHYSICALLY, 6),
];

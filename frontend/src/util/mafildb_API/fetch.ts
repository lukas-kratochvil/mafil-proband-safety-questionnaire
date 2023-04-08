import axiosConfig from "@app/axios-config";
import { devicesDev, projectsDev } from "@app/data/form_data";
import { dummyVisits } from "@app/data/visit_data";
import { AnswerOption, FormPropType } from "@app/model/form";
import { IVisit, IVisitIncludingQuestions, VisitStateDEV } from "@app/model/visit";
import { VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import { fetchQuestion } from "../server_API/fetch";
import { IDeviceDTO, IProjectDTO, VisitState } from "./dto";
import { CreateVisitResponse, UpdateVisitStateResponse } from "./response-types";

export const fetchProjects = async (): Promise<IProjectDTO[]> =>
  // TODO: uncomment
  // const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("projects.json");
  // return data.rows;
  projectsDev;

export const fetchDevices = async (): Promise<IDeviceDTO[]> =>
  // TODO: uncomment
  // const { data } = await axiosConfig.mafildbApi.get<DevicesResponse>("devices.json");
  // return data.rows;
  devicesDev;

// TODO: get visit from MAFILDB DB
export const fetchVisitForDuplication = async (
  visitId: string | undefined
): Promise<IVisitIncludingQuestions | undefined> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.id === visitId);

  if (visit === undefined) {
    return undefined;
  }

  const answersIncludingQuestions = await Promise.all(
    visit.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
      const question = await fetchQuestion(answer.questionId);
      return { ...answer, ...question, answer: AnswerOption.NO, comment: "" };
    })
  );
  return { ...visit, answersIncludingQuestions };
};

export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((dummyVisit) => dummyVisit.id === visitId);

// TODO: get visits from MAFIL DB – all the visits with assigned visitId and generated PDF are fetched from MAFIL DB
export const fetchRecentVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) =>
    [VisitStateDEV.APPROVED, VisitStateDEV.DISAPPROVED, VisitStateDEV.FOR_SIGNATURE, VisitStateDEV.SIGNED].includes(
      visit.state
    )
  );

// TODO: create visit in MAFILDB
export const createVisit = async (visitFormData: FormPropType, state: VisitState): Promise<string | undefined> => {
  const createData = {
    ...visitFormData,
    state,
  };
  const { data } = await axiosConfig.mafildbApi.post<CreateVisitResponse>("visit", createData);
  return data.visit_name;
};

// TODO: update visit state in MAFILDB
export const updateVisitState = async (visitId: string, state: VisitState): Promise<string | undefined> => {
  const updateData = { state };
  const { data } = await axiosConfig.mafildbApi.patch<UpdateVisitStateResponse>(`visit/${visitId}`, updateData);
  return data.visit_name;
};

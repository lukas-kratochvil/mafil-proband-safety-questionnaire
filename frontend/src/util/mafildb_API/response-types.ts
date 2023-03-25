import { IProjectDTO } from "./dto";

export type ProjectsResponse = {
  data: {
    rows: IProjectDTO[];
  };
};

export type CreateVisitResponse = {
  visit_name: string;
};

import { IProjectDTO } from "./dto";

export type ProjectsResponse = {
  data: {
    rows: IProjectDTO[];
  };
};

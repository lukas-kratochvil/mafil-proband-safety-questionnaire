import { IDeviceDTO, IProjectDTO } from "./dto";

export type ProjectsResponse = {
  data: {
    rows: IProjectDTO[];
  };
};

export type DevicesResponse = {
  data: {
    rows: IDeviceDTO[];
  };
};

export type CreateVisitResponse = {
  visit_name: string;
};

export type UpdateVisitStateResponse = {
  visit_name: string;
};

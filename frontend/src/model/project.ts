import type { MDB_IProjectDTO } from "@app/util/mafildb_API/dto";

export type IProject = {
  uuid: MDB_IProjectDTO["uuid"];
  acronym: MDB_IProjectDTO["acronym"];
  name: MDB_IProjectDTO["name"];
};

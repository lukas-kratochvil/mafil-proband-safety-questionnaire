import type { MDB_ProjectDTO } from "@app/util/mafildb_API/dto";

export type Project = {
  uuid: MDB_ProjectDTO["uuid"];
  acronym: MDB_ProjectDTO["acronym"];
  name: MDB_ProjectDTO["name"];
};

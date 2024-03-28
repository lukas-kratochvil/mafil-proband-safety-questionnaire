import type { MDB_DeviceDTO } from "@app/util/mafildb_API/dto";

export type Device = {
  id: MDB_DeviceDTO["id"];
  name: MDB_DeviceDTO["name"];
};

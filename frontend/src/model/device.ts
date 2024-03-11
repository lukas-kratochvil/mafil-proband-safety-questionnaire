import { MDB_IDeviceDTO } from "@app/util/mafildb_API/dto";

export interface IDevice {
  id: MDB_IDeviceDTO["id"];
  name: MDB_IDeviceDTO["name"];
}

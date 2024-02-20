import { MDB_VisitFileMimeType, MDB_VisitFileType } from "@app/util/mafildb_API/dto";

export interface IVisitPDF {
  id: number;
  name: string;
  uploaded: Date;
  fileType: MDB_VisitFileType;
  mimeType: MDB_VisitFileMimeType;
  content: string;
}

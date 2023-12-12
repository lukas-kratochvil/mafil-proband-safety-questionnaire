import { VisitFileMimeType, VisitFileType } from "@app/util/mafildb_API/dto";

export interface IVisitPDF {
  id: number;
  name: string;
  uploaded: Date;
  fileType: VisitFileType;
  mimeType: VisitFileMimeType;
  content: string;
}

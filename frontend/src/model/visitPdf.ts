import { MDB_IVisitFileDTO } from "@app/util/mafildb_API/dto";

export interface IVisitPDF {
  id: MDB_IVisitFileDTO["id"];
  name: MDB_IVisitFileDTO["name"]; // also contains extension, for example: my_doc.pdf
  uploaded: MDB_IVisitFileDTO["uploaded"];
  fileType: MDB_IVisitFileDTO["file_type"];
  mimeType: MDB_IVisitFileDTO["mime_type"];
  content: MDB_IVisitFileDTO["content"]; // Base64 encoded PDF content
}

import type { MDB_VisitFileDTO } from "@app/util/mafildb_API/dto";

export type VisitPDF = {
  id: MDB_VisitFileDTO["id"];
  name: MDB_VisitFileDTO["name"]; // also contains extension, for example: my_doc.pdf
  uploaded: MDB_VisitFileDTO["uploaded"];
  fileType: MDB_VisitFileDTO["file_type"];
  mimeType: MDB_VisitFileDTO["mime_type"];
  content: MDB_VisitFileDTO["content"]; // Base64 encoded PDF content
};

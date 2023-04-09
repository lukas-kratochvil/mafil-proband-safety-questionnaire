import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { GeneratePDFsArgs } from "./dto/generate-pdf.args";
import { PDFEntity, PDFType } from "./entities/pdf.entity";

@Injectable()
export class PDFService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(generatePDFsInput: GeneratePDFsArgs): Promise<PDFEntity[]> {
    const pdf = new PDFEntity();
    pdf.name = `PDF_file_${generatePDFsInput.surname}_${generatePDFsInput.name}`;
    pdf.extension = ".pdf";
    pdf.type = PDFType.PROBAND;
    pdf.content = "";
    return [pdf];
  }
}

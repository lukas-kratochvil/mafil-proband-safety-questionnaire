import { Args, Query, Resolver } from "@nestjs/graphql";
import { GeneratePDFArgs } from "./dto/generate-pdf.args";
import { PDFEntity } from "./entities/pdf.entity";
import { PDFService } from "./pdf.service";

@Resolver(() => PDFEntity)
export class PDFResolver {
  constructor(private readonly pdfService: PDFService) {}

  @Query(() => PDFEntity)
  generatePDF(@Args() generatePDFInput: GeneratePDFArgs): Promise<PDFEntity> {
    return this.pdfService.generate(generatePDFInput);
  }
}

import { Args, Query, Resolver } from "@nestjs/graphql";
import { GeneratePDFsArgs } from "./dto/generate-pdf.args";
import { PDFEntity } from "./entities/pdf.entity";
import { PDFService } from "./pdf.service";

@Resolver(() => PDFEntity)
export class PDFResolver {
  constructor(private readonly pdfService: PDFService) {}

  @Query(() => [PDFEntity])
  generatePDFs(@Args() generatePDFsInput: GeneratePDFsArgs): Promise<PDFEntity[]> {
    return this.pdfService.generate(generatePDFsInput);
  }
}

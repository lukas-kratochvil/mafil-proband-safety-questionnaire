import path from "path";
import { Injectable } from "@nestjs/common";
import { IPdfCommonItemsFile, IPdfTextsFile } from "@app/pdf/interfaces";
import { PrismaService } from "@app/prisma/prisma.service";
import { ProbandContactConsentEntity } from "./entities/proband-contact-consent.entity";

@Injectable()
export class ProbandContactConsentService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(locale: string): Promise<ProbandContactConsentEntity> {
    try {
      await this.prisma.language.findUniqueOrThrow({
        where: {
          code: locale,
        },
      });
    } catch {
      throw new Error(`Locale '${locale}' is not supported!`);
    }

    const dirPath = path.join(process.cwd(), "dist", "assets", "localization");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const texts: IPdfTextsFile = require(path.join(dirPath, `${locale}.json`));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const commonItems: IPdfCommonItemsFile = require(path.join(dirPath, "common.json"));

    const html = `
      <p style="margin-top: 0">${texts.probandContactConsent.text1}</p>
      <p>
        ${texts.probandContactConsent.text2}
        <br />
        ${texts.probandContactConsent.text3}
      </p>
      <p>${texts.probandContactConsent.text4}</p>
      <div>${texts.probandContactConsent.list}</div>
      <ul style="margin: 0">
      <li>${texts.probandContactConsent.listItem1} <u>${commonItems.mafilEmail}</u>,</li>
      <li>${texts.probandContactConsent.listItem2}</li>
      <li>${texts.probandContactConsent.listItem3}</li>
      <li>${texts.probandContactConsent.listItem4}</li>
      <li>${texts.probandContactConsent.listItem5Part1} <u>${commonItems.uoouSite}</u>, ${texts.probandContactConsent.listItem5Part2} <u>${commonItems.uoouEmail}</u>.</li>
      </ul>
      <p style="margin-bottom: 0">
        ${texts.probandContactConsent.text5Part1} <u>${commonItems.poverenecEmail}</u>.
        <br />${texts.probandContactConsent.text5Part2}
        <br /><u>${commonItems.personalInfoProtectionSite}</u>.
        <br />${texts.probandContactConsent.text5Part3}
        <br /><u>${commonItems.applicationOfDataSubjectRightsSite}</u>.
      </p>
    `;

    const probandContactConsent = new ProbandContactConsentEntity();
    probandContactConsent.title = texts.probandContactConsent.title;
    probandContactConsent.html = html;
    return probandContactConsent;
  }
}

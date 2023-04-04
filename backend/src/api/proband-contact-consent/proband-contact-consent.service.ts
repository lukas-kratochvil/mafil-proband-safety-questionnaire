import path from "path";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { ProbandContactConsentEntity } from "./entities/proband-contact-consent.entity";

interface IHtmlData {
  title: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  list: string;
  listItem1: string;
  listItem2: string;
  listItem3: string;
  listItem4: string;
  listItem5Part1: string;
  listItem5Part2: string;
  text5Part1: string;
  text5Part2: string;
  text5Part3: string;
}

interface ICommonHtmlData {
  mafilEmail: string;
  uoouSite: string;
  uoouEmail: string;
  poverenecEmail: string;
  personalInfoProtectionSite: string;
  applicationOfDataSubjectRightsSite: string;
}

@Injectable()
export class ProbandContactConsentService {
  private readonly logger: Logger;

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

    const dirPath = path.join(process.cwd(), "dist", "assets", "proband-contact-consent");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data: IHtmlData = require(path.join(dirPath, `${locale}.json`));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const commonStyledData: ICommonHtmlData = require(path.join(dirPath, "common.json"));

    const html = `
      <p style="margin-top: 0">${data.text1}</p>
      <p>
        ${data.text2}
        <br />
        ${data.text3}
      </p>
      <p>${data.text4}</p>
      <div>${data.list}</div>
      <ul style="margin: 0">
      <li>${data.listItem1} <u>${commonStyledData.mafilEmail}</u>,</li>
      <li>${data.listItem2}</li>
      <li>${data.listItem3}</li>
      <li>${data.listItem4}</li>
      <li>${data.listItem5Part1} <u>${commonStyledData.uoouSite}</u>, ${data.listItem5Part2} <u>${commonStyledData.uoouEmail}</u>.</li>
      </ul>
      <p style="margin-bottom: 0">
        ${data.text5Part1} <u>${commonStyledData.poverenecEmail}</u>.
        <br />${data.text5Part2}
        <br /><u>${commonStyledData.personalInfoProtectionSite}</u>.
        <br />${data.text5Part3}
        <br /><u>${commonStyledData.applicationOfDataSubjectRightsSite}</u>.
      </p>
    `;

    const probandContactConsent = new ProbandContactConsentEntity();
    probandContactConsent.title = data.title;
    probandContactConsent.bodyHtml = html;
    return probandContactConsent;
  }
}

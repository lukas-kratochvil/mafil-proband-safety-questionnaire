import path from "path";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { ProbandContactConsentEntity } from "./entities/proband-contact-consent.entity";

export interface IProbandContactConsentTexts {
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

export interface IProbandContactConsentCommonItems {
  mafilEmail: string;
  uoouSite: string;
  uoouEmail: string;
  poverenecEmail: string;
  personalInfoProtectionSite: string;
  applicationOfDataSubjectRightsSite: string;
}

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

    const dirPath = path.join(process.cwd(), "dist", "assets", "proband-contact-consent");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const texts: IProbandContactConsentTexts = require(path.join(dirPath, `${locale}.json`));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const commonItems: IProbandContactConsentCommonItems = require(path.join(dirPath, "common.json"));

    const html = `
      <p style="margin-top: 0">${texts.text1}</p>
      <p>
        ${texts.text2}
        <br />
        ${texts.text3}
      </p>
      <p>${texts.text4}</p>
      <div>${texts.list}</div>
      <ul style="margin: 0">
      <li>${texts.listItem1} <u>${commonItems.mafilEmail}</u>,</li>
      <li>${texts.listItem2}</li>
      <li>${texts.listItem3}</li>
      <li>${texts.listItem4}</li>
      <li>${texts.listItem5Part1} <u>${commonItems.uoouSite}</u>, ${texts.listItem5Part2} <u>${commonItems.uoouEmail}</u>.</li>
      </ul>
      <p style="margin-bottom: 0">
        ${texts.text5Part1} <u>${commonItems.poverenecEmail}</u>.
        <br />${texts.text5Part2}
        <br /><u>${commonItems.personalInfoProtectionSite}</u>.
        <br />${texts.text5Part3}
        <br /><u>${commonItems.applicationOfDataSubjectRightsSite}</u>.
      </p>
    `;

    const probandContactConsent = new ProbandContactConsentEntity();
    probandContactConsent.title = texts.title;
    probandContactConsent.html = html;
    return probandContactConsent;
  }
}

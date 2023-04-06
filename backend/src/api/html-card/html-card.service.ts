import path from "path";
import { Injectable } from "@nestjs/common";
import { IPdfCommonItemsFile, IPdfTextsFile } from "@app/pdf/interfaces";
import { PrismaService } from "@app/prisma/prisma.service";
import { HTMLCardEntity } from "./entities/html-card.entity";

const checkLocaleValidity = async (prisma: PrismaService, locale: string): Promise<void | never> => {
  try {
    await prisma.language.findUniqueOrThrow({
      where: {
        code: locale,
      },
    });
  } catch {
    throw new Error(`Locale '${locale}' is not supported!`);
  }
}

const DIR_PATH = path.join(process.cwd(), "dist", "assets", "localization");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getCommonTextsFile = (): IPdfCommonItemsFile => require(path.join(DIR_PATH, "common.json"));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getLocalizedTextsFile = (locale: string): IPdfTextsFile => require(path.join(DIR_PATH, `${locale}.json`));

const createHTMLCard = (title: string, html: string): HTMLCardEntity => {
  const probandContactConsent = new HTMLCardEntity();
  probandContactConsent.title = title;
  probandContactConsent.html = html;
  return probandContactConsent;
}

@Injectable()
export class HTMLCardService {
  constructor(private readonly prisma: PrismaService) {}

  async getProbandContactConsent(locale: string): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts: IPdfTextsFile = getLocalizedTextsFile(locale);
    const commonItems: IPdfCommonItemsFile = getCommonTextsFile();

    const html = `
      <p style="margin-top: 0">${texts.probandContact.consent.text1}</p>
      <p>
        ${texts.probandContact.consent.text2}
        <br />
        ${texts.probandContact.consent.text3}
      </p>
      <p>${texts.probandContact.consent.text4}</p>
      <div>${texts.probandContact.consent.list}</div>
      <ul style="margin: 0">
      <li>${texts.probandContact.consent.listItem1} <u>${commonItems.probandContact.consent.mafilEmail}</u>,</li>
      <li>${texts.probandContact.consent.listItem2}</li>
      <li>${texts.probandContact.consent.listItem3}</li>
      <li>${texts.probandContact.consent.listItem4}</li>
      <li>${texts.probandContact.consent.listItem5Part1} <u>${commonItems.probandContact.consent.uoouSite}</u>, ${texts.probandContact.consent.listItem5Part2} <u>${commonItems.probandContact.consent.uoouEmail}</u>.</li>
      </ul>
      <p style="margin-bottom: 0">
        ${texts.probandContact.consent.text5Part1} <u>${commonItems.probandContact.consent.poverenecEmail}</u>.
        <br />${texts.probandContact.consent.text5Part2}
        <br /><u>${commonItems.probandContact.consent.personalInfoProtectionSite}</u>.
        <br />${texts.probandContact.consent.text5Part3}
        <br /><u>${commonItems.probandContact.consent.applicationOfDataSubjectRightsSite}</u>.
      </p>
    `;

    return createHTMLCard(texts.probandContact.consent.title, html);
  }
}

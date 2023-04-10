import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { getCommonTextsFile, getLocalizedTextsFile } from "@app/utils/assets-loaders";
import { ProbandContactRequestArgs } from "./dto/proband-contact-request.args";
import { HTMLCardEntity } from "./entities/html-card.entity";

const checkLocaleValidity = async (prisma: PrismaService, locale: string): Promise<void | never> => {
  try {
    await prisma.language.findUniqueOrThrow({
      where: {
        code: locale,
      },
    });
  } catch {
    throw new BadRequestException(`Locale '${locale}' is not supported!`);
  }
};

const createHTMLCard = (title: string, html: string): HTMLCardEntity => {
  const probandContactConsent = new HTMLCardEntity();
  probandContactConsent.title = title;
  probandContactConsent.html = html;
  return probandContactConsent;
};

@Injectable()
export class HTMLCardService {
  constructor(private readonly prisma: PrismaService) {}

  async getProbandContactRequest(locale: string, data: ProbandContactRequestArgs): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts = getLocalizedTextsFile(locale);

    const html = `${texts.probandContact.request.text1}, ${data.name} ${data.surname} ${data.birthdateStr}, ${texts.probandContact.request.text2} ${data.currentDateStr} ${texts.probandContact.request.text3}:`;

    return createHTMLCard(texts.probandContact.request.title, html);
  }

  async getProbandContactConsent(locale: string): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts = getLocalizedTextsFile(locale);
    const commonTexts = getCommonTextsFile();

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
      <li>${texts.probandContact.consent.listItem1} <u>${commonTexts.probandContact.consent.mafilEmail}</u>,</li>
      <li>${texts.probandContact.consent.listItem2}</li>
      <li>${texts.probandContact.consent.listItem3}</li>
      <li>${texts.probandContact.consent.listItem4}</li>
      <li>${texts.probandContact.consent.listItem5Part1} <u>${commonTexts.probandContact.consent.uoouSite}</u>, ${texts.probandContact.consent.listItem5Part2} <u>${commonTexts.probandContact.consent.uoouEmail}</u>.</li>
      </ul>
      <p style="margin-bottom: 0">
        ${texts.probandContact.consent.text5Part1} <u>${commonTexts.probandContact.consent.poverenecEmail}</u>.
        <br />${texts.probandContact.consent.text5Part2}
        <br /><u>${commonTexts.probandContact.consent.personalInfoProtectionSite}</u>.
        <br />${texts.probandContact.consent.text5Part3}
        <br /><u>${commonTexts.probandContact.consent.applicationOfDataSubjectRightsSite}</u>.
      </p>
    `;

    return createHTMLCard(texts.probandContact.consent.title, html);
  }
}

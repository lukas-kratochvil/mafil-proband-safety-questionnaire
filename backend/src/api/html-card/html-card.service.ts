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

  async getEntryInfo(locale: string): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts = getLocalizedTextsFile(locale);

    const html = `
      <p style="margin-top: 0">${texts.entryInfo.text1}</p>
      <p style="margin-bottom: 0">${texts.entryInfo.text2}</p>
    `;

    return createHTMLCard(texts.entryInfo.title, html);
  }

  async getSafetyInfo(locale: string): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts = getLocalizedTextsFile(locale);

    const html = `${texts.safetyInfo.textPart1} <strong>${texts.safetyInfo.textPart2}</strong>`;

    return createHTMLCard(texts.safetyInfo.title, html);
  }

  async getBeforeExamination(locale: string): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts = getLocalizedTextsFile(locale);

    const html = `${texts.beforeExamination.textPart1} <strong>${texts.beforeExamination.textPart2}</strong> ${texts.beforeExamination.textPart3} <strong>${texts.beforeExamination.textPart4}</strong>, ${texts.beforeExamination.textPart5}`;

    return createHTMLCard(texts.beforeExamination.title, html);
  }

  async getExaminationConsent(locale: string): Promise<HTMLCardEntity | never> {
    await checkLocaleValidity(this.prisma, locale);

    const texts = getLocalizedTextsFile(locale);
    const commonTexts = getCommonTextsFile();

    const html = `
      <p style="margin-top: 0">${texts.examinationConsent.text1}</p>
      <p>${texts.examinationConsent.text2}</p>
      <p style="margin-bottom: 0">
        ${texts.examinationConsent.contactInfo}:
        <br />${texts.examinationConsent.mafil}, ${commonTexts.examinationConsent.ceitec}, ${texts.examinationConsent.masarykUni}, ${commonTexts.examinationConsent.mafilAddress}
        <br />${texts.examinationConsent.contactPerson}: ${commonTexts.examinationConsent.contactPerson}
        <br />${texts.examinationConsent.phone}: ${commonTexts.examinationConsent.phone}
        <br />${texts.examinationConsent.email}: ${commonTexts.examinationConsent.email}
      </p>
    `;

    return createHTMLCard(texts.examinationConsent.title, html);
  }

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
        <br />${texts.probandContact.consent.text3}
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

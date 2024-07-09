import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { getCommonTextsFile, getLocalizedTextsFile } from "@app/utils/assets-loaders";
import { ProbandContactRequestArgs } from "./dto/proband-contact-request.args";
import { HTMLCardEntity } from "./entities/html-card.entity";

@Injectable()
export class HTMLCardService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkLocaleValidity(locale: string): Promise<void | never> {
    try {
      await this.prisma.language.findUniqueOrThrow({
        where: {
          code: locale,
        },
      });
    } catch {
      throw new BadRequestException(`Locale '${locale}' is not supported!`);
    }
  }

  private createHTMLCard(title: string, html: string) {
    const htmlCard = new HTMLCardEntity();
    htmlCard.title = title;
    htmlCard.html = html;
    return htmlCard;
  }

  async getEntryInfo(locale: string): Promise<HTMLCardEntity | never> {
    await this.checkLocaleValidity(locale);
    const texts = getLocalizedTextsFile(locale);
    const html = `
      <p style="margin-top: 0">${texts.entryInfo.text1}</p>
      <p style="margin-bottom: 0">${texts.entryInfo.text2}</p>
    `;
    return this.createHTMLCard(texts.entryInfo.title, html);
  }

  async getSafetyInfo(locale: string): Promise<HTMLCardEntity | never> {
    await this.checkLocaleValidity(locale);
    const texts = getLocalizedTextsFile(locale);
    const html = `${texts.safetyInfo.textPart1} <strong>${texts.safetyInfo.textPart2}</strong>`;
    return this.createHTMLCard(texts.safetyInfo.title, html);
  }

  async getBeforeExamination(locale: string): Promise<HTMLCardEntity | never> {
    await this.checkLocaleValidity(locale);
    const texts = getLocalizedTextsFile(locale);
    const html = `${texts.beforeExamination.textPart1} <strong>${texts.beforeExamination.textPart2}</strong> ${texts.beforeExamination.textPart3} <strong>${texts.beforeExamination.textPart4}</strong>, ${texts.beforeExamination.textPart5} <u><strong>${texts.beforeExamination.textPart6}</strong></u> ${texts.beforeExamination.textPart7}`;
    return this.createHTMLCard(texts.beforeExamination.title, html);
  }

  async getExaminationConsent(locale: string): Promise<HTMLCardEntity | never> {
    await this.checkLocaleValidity(locale);
    const texts = getLocalizedTextsFile(locale);
    const commonTexts = getCommonTextsFile();
    const html = `
      <p style="margin-top: 0">${texts.examinationConsent.text1}</p>
      <p>${texts.examinationConsent.text2}</p>
      <p style="margin-bottom: 0">
        ${texts.examinationConsent.contactDetailsTitle}:
        <br />${texts.examinationConsent.contactDetails}
        <br />${texts.examinationConsent.contactPerson}: ${commonTexts.examinationConsent.contactPerson}
        <br />${texts.examinationConsent.phone}: ${commonTexts.examinationConsent.phone}
        <br />${texts.examinationConsent.email}: ${commonTexts.examinationConsent.mafilEmail}
      </p>
      <p>
        ${texts.examinationConsent.text3}:
        <br /><a href="${texts.examinationConsent.personalInfoProtectionSite}" target="_blank">${texts.examinationConsent.personalInfoProtectionSite}</a>
      </p>
    `;
    return this.createHTMLCard(texts.examinationConsent.title, html);
  }

  async getProbandContactRequest(locale: string, data: ProbandContactRequestArgs): Promise<HTMLCardEntity | never> {
    await this.checkLocaleValidity(locale);
    const texts = getLocalizedTextsFile(locale);
    const html = `${texts.probandContact.request.text1Part1}, ${data.name} ${data.surname}, ${texts.probandContact.request.text1Part2} ${data.birthdateStr}, ${texts.probandContact.request.text2} ${data.currentDateStr} ${texts.probandContact.request.text3}:`;
    return this.createHTMLCard(texts.probandContact.request.title, html);
  }

  async getProbandContactConsent(locale: string): Promise<HTMLCardEntity | never> {
    await this.checkLocaleValidity(locale);
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
      <li>${texts.probandContact.consent.listItem2},</li>
      <li>${texts.probandContact.consent.listItem3},</li>
      <li>${texts.probandContact.consent.listItem4},</li>
      <li>${texts.probandContact.consent.listItem5Part1} <u>${texts.probandContact.consent.listItem5UoouSite}</u>, ${texts.probandContact.consent.listItem5Part2} <u>${commonTexts.probandContact.consent.uoouEmail}</u>.</li>
      </ul>
      <p style="margin-bottom: 0">
        ${texts.probandContact.consent.text5Part1} <u>${commonTexts.probandContact.consent.trusteeEmail}</u>.
        <br />${texts.probandContact.consent.text5Part2}
        <br /><u>${texts.probandContact.consent.text5Part2PersonalInfoProtectionSite}</u>.
        <br />${texts.probandContact.consent.text5Part3}
        <br /><u>${texts.probandContact.consent.text5Part3ApplicationOfDataSubjectRightsSite}</u>.
      </p>
    `;
    return this.createHTMLCard(texts.probandContact.consent.title, html);
  }
}

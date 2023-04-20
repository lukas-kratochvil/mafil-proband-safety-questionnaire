import fs from "fs";
import { Readable } from "stream";
import { AnswerOption } from "@prisma/client";
import { Base64Encode } from "base64-stream";
import { format } from "date-fns";
import PDFDocument from "pdfkit";
import {
  CommonTextsFile,
  getCommonTextsFile,
  getFontPath,
  getImagePath,
  getLocalizedTextsFile,
  LocalizedTextsFile,
} from "@app/utils/assets-loaders";
import { IPDFData, IPDFQuestionAnswer } from "./interfaces";

// Default language for all the operator text translations
export const PDF_OPERATOR_LANGUAGE_CODE = "cs";

// Type of PDF document
type PDFDoc = typeof PDFDocument;

// Localization file nested types
type LocalizedVisitData = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "visitData">["visitData"];
type LocalizedPersonalData = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "personalData">["personalData"];
type LocalizedEntryInfoAndSafetyInfo = Pick<LocalizedTextsFile, "entryInfo" | "safetyInfo">;
type LocalizedQuestions = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "questions">["questions"];
type LocalizedProbandContact = Pick<LocalizedTextsFile, "probandContact">["probandContact"];
type LocalizedProbandContactRequest = Pick<LocalizedProbandContact, "request">["request"];
type LocalizedProbandContactConsent = Pick<LocalizedProbandContact, "consent">["consent"];
type CommonProbandContactConsent = Pick<
  Pick<CommonTextsFile, "probandContact">["probandContact"],
  "consent"
>["consent"];

//--------------------------------------
// PDF properties
//--------------------------------------
// Page margins
const PAGE_MARGIN = 60;

// Fonts
const REGULAR_FONT = "Roboto-regular";
const MEDIUM_FONT = "Roboto-medium";

// Font sizes
const HEADING_FONT_SIZE = 18;
const CHAPTER_FONT_SIZE = 14;
const TEXT_FONT_SIZE = 12;
const SECONDARY_TEXT_FONT_SIZE = 9;

// Gaps
const CHAPTER_GAP = 20;
const TITLE_VALUE_GAP = 10;
const DEFAULT_DOC_LINE_GAP = 10;
const LINE_GAP_INSIDE_PARAGRAPH = 1;
const INPUTS_GAP = 4;
const SECONDARY_TEXT_GAP = 1;

// Indents
const PARAGRAPH_INDENT = 20;

// Date format
const DATE_FORMAT = "d.M.y";
//--------------------------------------

interface ITitleValueRow {
  title: string;
  secondaryTitle?: string;
  value: string;
  secondaryValue?: string;
}

const addChapterTitle = (doc: PDFDoc, x: number, y: number, title: string, secondaryTitle?: string): void => {
  const gapAfterChapterTitle = INPUTS_GAP + 4;

  if (secondaryTitle) {
    doc
      .font(MEDIUM_FONT, CHAPTER_FONT_SIZE)
      .text(title, x, y, { continued: true })
      .font(REGULAR_FONT)
      .text(` (${secondaryTitle})`, { lineGap: gapAfterChapterTitle });
    return;
  }

  doc.font(MEDIUM_FONT, CHAPTER_FONT_SIZE).text(title, x, y, { lineGap: gapAfterChapterTitle });
};

const addTitleValue = (doc: PDFDoc, row: ITitleValueRow, x: number, y?: number): void => {
  const title = `${row.title}:`;
  const titleWidth = 150;
  const valueStartPosition = x + titleWidth + TITLE_VALUE_GAP;

  if (row.secondaryTitle) {
    const secondaryTitle = `(${row.secondaryTitle})`;

    if (row.secondaryValue) {
      const secondaryValue = `(${row.secondaryValue})`;

      doc.fontSize(TEXT_FONT_SIZE).text(title, x, y, { width: titleWidth });
      doc.moveUp().text(row.value, valueStartPosition, y, { lineGap: SECONDARY_TEXT_GAP });
      doc.fontSize(SECONDARY_TEXT_FONT_SIZE).text(secondaryTitle, x, undefined, { width: titleWidth });
      doc.moveUp().text(secondaryValue, valueStartPosition, undefined, { paragraphGap: INPUTS_GAP });
      return;
    }

    doc.fontSize(TEXT_FONT_SIZE).text(title, x, y, { width: titleWidth });
    doc.moveUp().text(row.value, valueStartPosition, y, { lineGap: SECONDARY_TEXT_GAP });
    doc
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(secondaryTitle, x, undefined, { width: titleWidth, paragraphGap: INPUTS_GAP });
    return;
  }

  doc.fontSize(TEXT_FONT_SIZE).text(title, x, y, { width: titleWidth });
  doc.moveUp().text(row.value, valueStartPosition, y, { paragraphGap: INPUTS_GAP });
};

const addTitleValueRows = (
  doc: PDFDoc,
  x: number,
  y: number,
  title: string,
  secondaryTitle: string | undefined,
  rows: ITitleValueRow[]
): void => {
  addChapterTitle(doc, x, y, title, secondaryTitle);
  doc.font(REGULAR_FONT, TEXT_FONT_SIZE).lineGap(LINE_GAP_INSIDE_PARAGRAPH);
  rows.forEach((row, i) => addTitleValue(doc, row, x, i === 0 ? doc.y : undefined));
  doc.lineGap(DEFAULT_DOC_LINE_GAP);
};

const addVisitData = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedVisitData,
  secondaryTexts: LocalizedVisitData | undefined,
  data: IPDFData
): void => {
  const visitInfoRows: ITitleValueRow[] = [
    { title: "Visit ID", value: data.visitId },
    { title: texts.project, secondaryTitle: secondaryTexts?.project, value: data.projectAcronym },
    {
      title: texts.measurementDate,
      secondaryTitle: secondaryTexts?.measurementDate,
      value: format(data.measurementDate, DATE_FORMAT),
    },
  ];

  // Add phantom row if the visit is phantom
  if (data.isPhantom) {
    visitInfoRows.push({ title: texts.phantom, value: texts.phantomYes });
  }

  addTitleValueRows(doc, x, y, texts.title, secondaryTexts?.title, visitInfoRows);
};

const addPersonalData = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedPersonalData,
  secondaryTexts: LocalizedPersonalData | undefined,
  data: IPDFData
): void => {
  const probandInfoRows: ITitleValueRow[] = [
    { title: texts.name, secondaryTitle: secondaryTexts?.name, value: data.name },
    { title: texts.surname, secondaryTitle: secondaryTexts?.surname, value: data.surname },
    { title: texts.personalId, secondaryTitle: secondaryTexts?.personalId, value: data.personalId },
    { title: texts.birthdate, secondaryTitle: secondaryTexts?.birthdate, value: format(data.birthdate, DATE_FORMAT) },
    {
      title: texts.gender,
      secondaryTitle: secondaryTexts?.gender,
      value: data.gender.text,
      secondaryValue: data.gender.secondaryText,
    },
    {
      title: texts.nativeLanguage,
      secondaryTitle: secondaryTexts?.nativeLanguage,
      value: data.nativeLanguage.text,
      secondaryValue: data.nativeLanguage.secondaryText,
    },
    { title: texts.height, secondaryTitle: secondaryTexts?.height, value: `${data.heightCm} cm` },
    { title: texts.weight, secondaryTitle: secondaryTexts?.weight, value: `${data.weightKg} kg` },
    {
      title: texts.visualCorrection,
      secondaryTitle: secondaryTexts?.visualCorrection,
      value: `${data.visualCorrectionDioptre} D`,
    },
    {
      title: texts.handedness,
      secondaryTitle: secondaryTexts?.handedness,
      value: data.handedness.text,
      secondaryValue: data.handedness.secondaryText,
    },
  ];
  addTitleValueRows(doc, x, y, texts.title, secondaryTexts?.title, probandInfoRows);
};

const addEntryInfo = (doc: PDFDoc, x: number, y: number, texts: LocalizedEntryInfoAndSafetyInfo): void => {
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(texts.entryInfo.text1, x, y, {
      indent: PARAGRAPH_INDENT,
      align: "justify",
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    })
    .text(texts.entryInfo.text2, { indent: PARAGRAPH_INDENT, align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(`${texts.safetyInfo.textPart1} `, {
      indent: PARAGRAPH_INDENT,
      align: "justify",
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    })
    .font(MEDIUM_FONT)
    .text(texts.safetyInfo.textPart2, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH });
};

const addQuestions = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedQuestions,
  secondaryTexts: LocalizedQuestions | undefined,
  questions: IPDFQuestionAnswer[]
): void => {
  addChapterTitle(doc, x, y, texts.title, secondaryTexts?.title);
  questions.forEach(({ questionText, questionSecondaryText, answer, comment }) => {
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${questionText} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
      .font(MEDIUM_FONT, TEXT_FONT_SIZE)
      .text((answer === AnswerOption.YES ? texts.answerYes : texts.answerNo).toUpperCase(), {
        paragraphGap: questionSecondaryText || comment ? SECONDARY_TEXT_GAP : INPUTS_GAP,
      });

    if (secondaryTexts && questionSecondaryText) {
      doc
        .font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE)
        .text(`(${questionSecondaryText} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
        .font(MEDIUM_FONT, SECONDARY_TEXT_FONT_SIZE)
        .text(`${(answer === AnswerOption.YES ? secondaryTexts.answerYes : secondaryTexts.answerNo).toUpperCase()})`, {
          paragraphGap: comment ? 2 : INPUTS_GAP,
        });
    }

    if (comment) {
      if (secondaryTexts) {
        doc
          .font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE)
          .text(`${texts.comment} (${secondaryTexts.comment}): ${comment}`, {
            align: "justify",
            lineGap: LINE_GAP_INSIDE_PARAGRAPH,
            paragraphGap: INPUTS_GAP,
          });
        return;
      }

      doc.font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE).text(`${texts.comment}: ${comment}`, {
        align: "justify",
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
        paragraphGap: INPUTS_GAP,
      });
    }
  });
};

const addProbandContactRequest = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedProbandContactRequest,
  data: IPDFData
): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, x, y, { align: "center" });
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(
      `${texts.text1}, ${data.name} ${data.surname} ${format(data.birthdate, DATE_FORMAT)} ${texts.text2} ${format(
        data.measurementDate,
        DATE_FORMAT
      )} ${texts.text3}:`,
      { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: 10 }
    );
  doc
    .font(MEDIUM_FONT, TEXT_FONT_SIZE)
    .text(texts.emailAddress, { continued: true })
    .font(REGULAR_FONT)
    .text(` (${texts.emailAddressInfo}): ${data.email}`, { lineGap: 10 });
  doc
    .font(MEDIUM_FONT, TEXT_FONT_SIZE)
    .text(texts.phoneNumber, { continued: true })
    .font(REGULAR_FONT)
    .text(` (${texts.phoneNumberInfo}): ${data.phone}`);
};

const addProbandContactConsent = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedProbandContactConsent,
  commonTexts: CommonProbandContactConsent
): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, x, y, { align: "center" });
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(texts.text1, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: 10 });
  doc
    .text(texts.text2, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.text3, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: 10 });
  doc.text(texts.text4, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: 10 });
  doc.text(texts.list, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: 4 });
  // List bullet indentation doesn't work
  doc.list([`${texts.listItem1} ${commonTexts.mafilEmail}`, texts.listItem2, texts.listItem3, texts.listItem4], {
    listType: "bullet",
    bulletRadius: 3,
    align: "justify",
    lineGap: LINE_GAP_INSIDE_PARAGRAPH,
  });
  // Workaround: the last list item must be added separately to create gap under the list
  doc.list([`${texts.listItem5Part1} ${texts.listItem5UoouSite} ${texts.listItem5Part2} ${commonTexts.uoouEmail}.`], {
    listType: "bullet",
    bulletRadius: 3,
    align: "justify",
    lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    paragraphGap: 10,
  });
  doc
    .text(`${texts.text5Part1} ${commonTexts.poverenecEmail}.`, {
      align: "justify",
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    })
    .text(`${texts.text5Part2} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
    .text(texts.text5Part2PersonalInfoProtectionSite, { align: "justify", continued: true })
    .text(".")
    .text(`${texts.text5Part3} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
    .text(texts.text5Part3ApplicationOfDataSubjectRightsSite, {
      align: "justify",
      continued: true,
    })
    .text(".", { paragraphGap: 25 });

  // Fill in date
  const inBrnoOnText = `${texts.inBrnoOn} `;
  const inBrnoOnTextWidth = doc.widthOfString(inBrnoOnText);
  const inBrnoOnLineYCorrection = doc.heightOfString(inBrnoOnText) / 2;
  doc.text(inBrnoOnText);
  doc
    .lineTo(doc.x + inBrnoOnTextWidth + 2, doc.y - inBrnoOnLineYCorrection)
    .lineTo(doc.x + inBrnoOnTextWidth + 100, doc.y - inBrnoOnLineYCorrection)
    .dash(2, { space: 3 })
    .stroke();

  // Fill in signature
  const signatureLineY = doc.y + 20;
  doc
    .lineTo(doc.x, signatureLineY)
    .lineTo(doc.x + 200, signatureLineY)
    .dash(2, { space: 3 })
    .stroke();
  doc.text(texts.signature, PAGE_MARGIN, signatureLineY + 2);
};

const streamToString = (stream: Readable): Promise<string | never> => {
  let data = "";
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: string) => (data += chunk));
    stream.on("error", (error: Error) => reject(error));
    stream.on("end", () => resolve(data));
  });
};

export const generatePDF = async (
  data: IPDFData,
  locale: string,
  secondaryLocale?: string
): Promise<string | never> => {
  const texts = getLocalizedTextsFile(locale);
  let secondaryTexts: LocalizedTextsFile | undefined = undefined;
  const commonTexts = getCommonTextsFile();

  if (secondaryLocale) {
    secondaryTexts = getLocalizedTextsFile(secondaryLocale);
  }

  // Create PDF document
  const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN });

  // Register and use Roboto font family that supports UNICODE characters
  doc.registerFont(REGULAR_FONT, getFontPath("roboto/Roboto-Regular.ttf"));
  doc.registerFont(MEDIUM_FONT, getFontPath("roboto/Roboto-Medium.ttf"));

  // Setup Base64 stream
  const stream = doc.pipe(new Base64Encode());

  // TODO: delete - only for development purpose
  const pdfFile = fs.createWriteStream(`output_${Date.now()}.pdf`);
  doc.pipe(pdfFile);

  // Set default line gap in the document
  doc.lineGap(DEFAULT_DOC_LINE_GAP);

  // Add MAFIL logo
  const imageWidth = 90;
  doc.image(getImagePath("mafil_brain_logo.png"), { width: imageWidth });
  const onMafilLogoRightContentX = imageWidth + 110;
  const linePositionUnderImage = doc.y;

  // Add MAFIL info
  doc
    .font(MEDIUM_FONT, CHAPTER_FONT_SIZE)
    .text(commonTexts.mafil.ceitec, onMafilLogoRightContentX, PAGE_MARGIN + 30, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.pdf.mafil.name, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.pdf.mafil.workplace, { paragraphGap: 10 });

  // Add visit information
  addVisitData(doc, PAGE_MARGIN, linePositionUnderImage + 30, texts.pdf.visitData, secondaryTexts?.pdf.visitData, data);

  // Add proband information
  addPersonalData(
    doc,
    PAGE_MARGIN,
    doc.y + CHAPTER_GAP,
    texts.pdf.personalData,
    secondaryTexts?.pdf.personalData,
    data
  );

  if (!data.isPhantom) {
    // Add entry info
    addEntryInfo(doc, doc.page.margins.left, doc.y + CHAPTER_GAP, texts);

    // Add safety questions
    addQuestions(
      doc,
      PAGE_MARGIN,
      doc.y + CHAPTER_GAP,
      texts.pdf.questions,
      secondaryTexts?.pdf.questions,
      data.answers
    );

    // Add proband contact consent if proband requested sending research results via email and phone
    if (data.email && data.phone) {
      doc.addPage();

      // Request
      addProbandContactRequest(doc, PAGE_MARGIN, doc.y, texts.probandContact.request, data);

      // Consent
      addProbandContactConsent(
        doc,
        PAGE_MARGIN,
        doc.y + CHAPTER_GAP,
        texts.probandContact.consent,
        commonTexts.probandContact.consent
      );
    }
  }

  doc.end();
  const content = await streamToString(stream);
  stream.destroy();
  // TODO: delete - only for development purpose
  pdfFile.end();
  return content;
};

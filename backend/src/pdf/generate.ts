import fs from "fs";
import { Readable } from "stream";
import { AnswerOption } from "@prisma/client";
import { Base64Encode } from "base64-stream";
import { format } from "date-fns";
import PDFDocument from "pdfkit";
import { PDFType } from "@app/api/pdf/entities/pdf.entity";
import {
  CommonTextsFile,
  getCommonTextsFile,
  getFontPath,
  getImagePath,
  getLocalizedTextsFile,
  LocalizedTextsFile,
} from "@app/utils/assets-loaders";
import { IPDFData, IQuestionAnswer } from "./interfaces";

// Type of PDF document
type PDFDoc = typeof PDFDocument;

// Localization file nested types
type LocalizedQuestions = Pick<LocalizedTextsFile, "questions">["questions"];
type LocalizedProbandContact = Pick<LocalizedTextsFile, "probandContact">["probandContact"];
type LocalizedProbandContactRequest = Pick<LocalizedProbandContact, "request">["request"];
type LocalizedProbandContactConsent = Pick<LocalizedProbandContact, "consent">["consent"];
type CommonProbandContactConsent = Pick<
  Pick<CommonTextsFile, "probandContact">["probandContact"],
  "consent"
>["consent"];

// PDF properties
const REGULAR_FONT = "Roboto-regular";
const MEDIUM_FONT = "Roboto-medium";
const HEADING_FONT_SIZE = 20;
const CHAPTER_FONT_SIZE = 16;
const TEXT_FONT_SIZE = 12;
const PAGE_MARGIN = 60;
const TITLE_VALUE_GAP = 10;
const DEFAULT_DOC_LINE_GAP = 10;
const LINE_GAP_INSIDE_PARAGRAPH = 2;
const DATE_FORMAT = "d.M.y";

interface ITitleValueRow {
  title: string;
  value: string;
}

const addTitleValue = (doc: PDFDoc, row: ITitleValueRow, x: number, y?: number): void => {
  const titleWidth = 150;
  const valueStartPosition = x + titleWidth + TITLE_VALUE_GAP;
  doc
    .font(MEDIUM_FONT, TEXT_FONT_SIZE)
    .text(`${row.title}:`, x, y, { width: titleWidth })
    .moveUp()
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(row.value, valueStartPosition, undefined, { paragraphGap: 4 });
};

const addTitleValueRows = (doc: PDFDoc, rows: ITitleValueRow[], x: number, y: number): void => {
  rows.forEach((row, i) => addTitleValue(doc, row, x, i === 0 ? y : undefined));
};

const addQuestions = (doc: PDFDoc, texts: LocalizedQuestions, questions: IQuestionAnswer[]): void => {
  doc.font(MEDIUM_FONT, CHAPTER_FONT_SIZE).text(texts.title, PAGE_MARGIN, doc.y + 30);
  questions.forEach(({ questionText, answer }) => {
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${questionText} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
      .font(MEDIUM_FONT, TEXT_FONT_SIZE)
      .text((answer === AnswerOption.YES ? texts.answerYes : texts.answerNo).toUpperCase(), { paragraphGap: 8 });
  });
};

const addProbandContactRequest = (doc: PDFDoc, texts: LocalizedProbandContactRequest, data: IPDFData): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, { align: "center" });
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
    .text(` (${texts.phoneNumberInfo}): ${data.phone}`, { paragraphGap: 25 });
};

const addProbandContactConsent = (
  doc: PDFDoc,
  texts: LocalizedProbandContactConsent,
  commonTexts: CommonProbandContactConsent
): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, { align: "center" });
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
  doc.list([`${texts.listItem5Part1} ${commonTexts.uoouSite} ${texts.listItem5Part2} ${commonTexts.uoouEmail}.`], {
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
    .text(commonTexts.personalInfoProtectionSite, { align: "justify", continued: true })
    .text(".")
    .text(`${texts.text5Part3} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
    .text(commonTexts.applicationOfDataSubjectRightsSite, {
      align: "justify",
      continued: true,
    })
    .text(".");
};

const streamToString = (stream: Readable): Promise<string | never> => {
  let data = "";
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: string) => (data += chunk));
    stream.on("error", (error: Error) => reject(error));
    stream.on("end", () => resolve(data));
  });
};

export const generatePDF = async (pdfType: PDFType, data: IPDFData, locale: string): Promise<string | never> => {
  const texts = getLocalizedTextsFile(locale);
  const commonTexts = getCommonTextsFile();

  // Create PDF document
  const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN });

  // Register and use Roboto font family that supports UNICODE characters
  doc.registerFont(REGULAR_FONT, getFontPath("roboto/Roboto-Regular.ttf"));
  doc.registerFont(MEDIUM_FONT, getFontPath("roboto/Roboto-Medium.ttf"));

  // Setup Base64 stream
  const stream = doc.pipe(new Base64Encode());

  // Set default line gap in the document
  doc.lineGap(DEFAULT_DOC_LINE_GAP);

  let linePosition = 0;

  // TODO: edit header as here: https://pspdfkit.com/blog/2019/generate-pdf-invoices-pdfkit-nodejs/
  // Add full-width border box with "Phantom" inside
  if (pdfType === PDFType.PHANTOM) {
    const reactY = 25;
    const rectHeight = 50;
    doc
      .rect(200, reactY, 200, rectHeight)
      .fillAndStroke("#ab5", "black")
      .fill("white")
      .stroke()
      .font(MEDIUM_FONT, CHAPTER_FONT_SIZE)
      .text(texts.inputTitles.phantom.toUpperCase(), { align: "center" })
      .fill("black"); // return back to the black font color
    linePosition = reactY + rectHeight + 25;
  } else {
    linePosition = 75;
  }

  // Add MAFIL logo
  const imageWidth = 130;
  doc.image(getImagePath("mafil_brain_logo.png"), { width: imageWidth });
  const linePositionUnderImage = doc.y;

  // Add visit information
  const visitInfoRows: ITitleValueRow[] = [
    { title: "Visit ID", value: data.visitId },
    { title: texts.inputTitles.project, value: data.projectAcronym },
    { title: texts.inputTitles.measurementDate, value: format(data.measurementDate, DATE_FORMAT) },
  ];
  addTitleValueRows(doc, visitInfoRows, imageWidth + 70, linePosition);

  // Add proband information
  const probandInfoRows: ITitleValueRow[] = [
    { title: texts.inputTitles.name, value: data.name },
    { title: texts.inputTitles.surname, value: data.surname },
    { title: texts.inputTitles.personalId, value: data.personalId },
    { title: texts.inputTitles.birthdate, value: format(data.birthdate, DATE_FORMAT) },
    { title: texts.inputTitles.gender, value: data.gender },
    { title: texts.inputTitles.nativeLanguage, value: data.nativeLanguage },
    { title: texts.inputTitles.height, value: `${data.heightCm} cm` },
    { title: texts.inputTitles.weight, value: `${data.weightKg} kg` },
    { title: texts.inputTitles.visualCorrection, value: `${data.visualCorrectionDioptre} D` },
    { title: texts.inputTitles.handedness, value: data.handedness },
  ];
  addTitleValueRows(doc, probandInfoRows, PAGE_MARGIN, linePositionUnderImage + 30);

  if (pdfType !== PDFType.PHANTOM) {
    // Add safety questions
    addQuestions(doc, texts.questions, data.answers);

    // TODO: maybe different layout for the proband and operator PDF
    // if (pdfType === PDFType.PROBAND) {
    //   // TODO
    // } else if (pdfType === PDFType.OPERATOR) {
    //   // TODO
    //   const questionsPartOne = data.answers.filter((answer) => answer.partNumber === 1);
    //   const questionsPartTwo = data.answers.filter((answer) => answer.partNumber === 2);
    // }

    // Add proband contact consent if proband requested sending research results via email and phone
    if (data.email && data.phone) {
      doc.addPage();

      // Request
      addProbandContactRequest(doc, texts.probandContact.request, data);

      // Consent
      addProbandContactConsent(doc, texts.probandContact.consent, commonTexts.probandContact.consent);
    }
  }

  doc.end();
  const content = await streamToString(stream);
  stream.destroy();
  return content;
};

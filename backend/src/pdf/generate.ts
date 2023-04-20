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
type LocalizedQuestions = Pick<LocalizedTextsFile, "questions">["questions"];
type LocalizedVisitData = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "visitData">["visitData"];
type LocalizedPersonalData = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "personalData">["personalData"];
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

// Gaps
const CHAPTER_GAP = 20;
const TITLE_VALUE_GAP = 10;
const DEFAULT_DOC_LINE_GAP = 10;
const LINE_GAP_INSIDE_PARAGRAPH = 2;
const INPUTS_GAP = LINE_GAP_INSIDE_PARAGRAPH * 2;

// Date format
const DATE_FORMAT = "d.M.y";
//--------------------------------------

interface ITitleValueRow {
  title: string;
  value: string;
}

const addTitleValue = (doc: PDFDoc, row: ITitleValueRow, x: number, y?: number): void => {
  const titleWidth = 150;
  const valueStartPosition = x + titleWidth + TITLE_VALUE_GAP;
  doc
    .text(`${row.title}:`, x, y, { width: titleWidth })
    .moveUp()
    .text(row.value, valueStartPosition, undefined, { paragraphGap: INPUTS_GAP });
};

const addTitleValueRows = (doc: PDFDoc, x: number, y: number, title: string, rows: ITitleValueRow[]): void => {
  doc.font(MEDIUM_FONT, CHAPTER_FONT_SIZE).text(title, x, y);
  doc.font(REGULAR_FONT, TEXT_FONT_SIZE).lineGap(LINE_GAP_INSIDE_PARAGRAPH);
  rows.forEach((row, i) => addTitleValue(doc, row, x, i === 0 ? doc.y : undefined));
  doc.lineGap(DEFAULT_DOC_LINE_GAP);
};

const addVisitData = (doc: PDFDoc, x: number, y: number, texts: LocalizedVisitData, data: IPDFData): void => {
  const visitInfoRows: ITitleValueRow[] = [
    { title: "Visit ID", value: data.visitId },
    { title: texts.project, value: data.projectAcronym },
    { title: texts.measurementDate, value: format(data.measurementDate, DATE_FORMAT) },
  ];

  // Add phantom row if the visit is phantom
  if (data.isPhantom) {
    visitInfoRows.push({ title: texts.phantom, value: texts.phantomYes });
  }

  addTitleValueRows(doc, x, y, texts.title, visitInfoRows);
};

const addPersonalData = (doc: PDFDoc, x: number, y: number, texts: LocalizedPersonalData, data: IPDFData): void => {
  const probandInfoRows: ITitleValueRow[] = [
    { title: texts.name, value: data.name },
    { title: texts.surname, value: data.surname },
    { title: texts.personalId, value: data.personalId },
    { title: texts.birthdate, value: format(data.birthdate, DATE_FORMAT) },
    { title: texts.gender, value: data.gender.text },
    { title: texts.nativeLanguage, value: data.nativeLanguage.text },
    { title: texts.height, value: `${data.heightCm} cm` },
    { title: texts.weight, value: `${data.weightKg} kg` },
    { title: texts.visualCorrection, value: `${data.visualCorrectionDioptre} D` },
    { title: texts.handedness, value: data.handedness.text },
  ];
  addTitleValueRows(doc, x, y, texts.title, probandInfoRows);
};

const addQuestions = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedQuestions,
  questions: IPDFQuestionAnswer[]
): void => {
  doc.font(MEDIUM_FONT, CHAPTER_FONT_SIZE).text(texts.title, x, y);
  questions.forEach(({ questionText, answer }) => {
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${questionText} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
      .font(MEDIUM_FONT, TEXT_FONT_SIZE)
      .text((answer === AnswerOption.YES ? texts.answerYes : texts.answerNo).toUpperCase(), {
        paragraphGap: INPUTS_GAP,
      });
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
  const commonTexts = getCommonTextsFile();

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
  addVisitData(doc, PAGE_MARGIN, linePositionUnderImage + 30, texts.pdf.visitData, data);

  // Add proband information
  addPersonalData(doc, PAGE_MARGIN, doc.y + CHAPTER_GAP, texts.pdf.personalData, data);

  if (!data.isPhantom) {
    // Add safety questions
    addQuestions(doc, PAGE_MARGIN, doc.y + CHAPTER_GAP, texts.questions, data.answers);

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

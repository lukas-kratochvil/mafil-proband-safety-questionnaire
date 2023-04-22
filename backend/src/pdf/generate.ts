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

// Type of PDF document
type PDFDoc = typeof PDFDocument;

// Localization file nested types
type LocalizedVisitData = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "visitData">["visitData"];
type LocalizedPersonalData = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "personalData">["personalData"];
type LocalizedEntryInfoAndSafetyInfo = Pick<LocalizedTextsFile, "entryInfo" | "safetyInfo">;
type LocalizedQuestions = Pick<Pick<LocalizedTextsFile, "pdf">["pdf"], "questions">["questions"];
type LocalizedBeforeExaminationInfo = Pick<LocalizedTextsFile, "beforeExamination">["beforeExamination"];
type LocalizedExaminationConsent = Pick<LocalizedTextsFile, "examinationConsent">["examinationConsent"];
type LocalizedProbandContact = Pick<LocalizedTextsFile, "probandContact">["probandContact"];
type LocalizedProbandContactRequest = Pick<LocalizedProbandContact, "request">["request"];
type LocalizedProbandContactConsent = Pick<LocalizedProbandContact, "consent">["consent"];

type CommonExaminationConsent = Pick<CommonTextsFile, "examinationConsent">["examinationConsent"];
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
const DEFAULT_DOC_LINE_GAP = 10;
const GAP_BEFORE_CHAPTER = 20;
const GAP_AFTER_HEADING_TITLE = 10;
const LINE_GAP_INSIDE_PARAGRAPH = 1;
const TEXT_PARAGRAPHS_GAP = 8;
const SECONDARY_TEXT_GAP = 1;
const INPUT_ROWS_GAP = 4;
const GAP_AFTER_CHAPTER_TITLE = INPUT_ROWS_GAP + 4;
const GAP_AROUND_SIGNATURE_BLOCKS = 25;

// Indents
const PARAGRAPH_INDENT = 20;

// Date format
const DATE_FORMAT = "d.M.y";

// List options
const LIST_BULLET_RADIUS = 3;
const LIST_BASELINE = "hanging";

// Dashes
const IN_BRNO_ON_DASHES = "_ _ _ _ _ _ _ _ _ _ _ _";
const SIGNATURE_DASHES = "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _";
//--------------------------------------

interface ITitleValueRow {
  title: string;
  secondaryTitle?: string;
  value: string;
  secondaryValue?: string;
  isRowBold?: boolean;
}

const onNewPageAdded = (doc: PDFDoc, visitIdTitle: string, visitIdValue: string) => {
  const docX = doc.x;
  const docY = doc.y;

  doc.fontSize(TEXT_FONT_SIZE);
  const title = `${visitIdTitle}: `;
  const value = visitIdValue;
  const textX
    = doc.page.width
    - doc.page.margins.right
    - doc.font(MEDIUM_FONT).widthOfString(title)
    - doc.font(REGULAR_FONT).widthOfString(value);
  doc
    .font(MEDIUM_FONT)
    .text(title, textX, doc.page.margins.top / 2, { continued: true })
    .font(REGULAR_FONT)
    .text(value);

  doc.x = docX;
  doc.y = docY;
};

const addBlockTitle = (
  doc: PDFDoc,
  x: number,
  y: number,
  fontSize: number,
  gapAfterTitle: number,
  title: string,
  secondaryTitle?: string
): void => {
  if (secondaryTitle) {
    doc
      .font(MEDIUM_FONT, fontSize)
      .text(title, x, y, { lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
      .font(REGULAR_FONT)
      .text(` (${secondaryTitle})`, { lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: gapAfterTitle });
    return;
  }

  doc
    .font(MEDIUM_FONT, fontSize)
    .text(title, x, y, { lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: gapAfterTitle });
};

const addTitleValue = (doc: PDFDoc, row: ITitleValueRow, x: number, y?: number): void => {
  const title = `${row.title}:`;
  const titleWidth = 150;
  const valueStartPosition = x + titleWidth + 10;
  const titleFont = row.isRowBold ? MEDIUM_FONT : REGULAR_FONT;

  if (row.secondaryTitle) {
    const secondaryTitle = `(${row.secondaryTitle})`;

    if (row.secondaryValue) {
      const secondaryValue = `(${row.secondaryValue})`;

      doc.font(titleFont, TEXT_FONT_SIZE).text(title, x, y, { width: titleWidth });
      doc.moveUp().text(row.value, valueStartPosition, y, { lineGap: SECONDARY_TEXT_GAP });
      doc.fontSize(SECONDARY_TEXT_FONT_SIZE).text(secondaryTitle, x, undefined, { width: titleWidth });
      doc.moveUp().text(secondaryValue, valueStartPosition, undefined, { paragraphGap: INPUT_ROWS_GAP });
      return;
    }

    doc.font(titleFont, TEXT_FONT_SIZE).text(title, x, y, { width: titleWidth });
    doc.moveUp().text(row.value, valueStartPosition, y, { lineGap: SECONDARY_TEXT_GAP });
    doc
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(secondaryTitle, x, undefined, { width: titleWidth, paragraphGap: INPUT_ROWS_GAP });
    return;
  }

  doc.font(titleFont, TEXT_FONT_SIZE).text(title, x, y, { width: titleWidth });
  doc.moveUp().text(row.value, valueStartPosition, y, { paragraphGap: INPUT_ROWS_GAP });
};

const addTitleValueRows = (
  doc: PDFDoc,
  x: number,
  y: number,
  blockTitle: string,
  secondaryBlockTitle: string | undefined,
  rows: ITitleValueRow[]
): void => {
  addBlockTitle(doc, x, y, CHAPTER_FONT_SIZE, GAP_AFTER_CHAPTER_TITLE, blockTitle, secondaryBlockTitle);
  doc.font(REGULAR_FONT, TEXT_FONT_SIZE).lineGap(LINE_GAP_INSIDE_PARAGRAPH);
  rows.forEach((row, i) => addTitleValue(doc, row, x, i === 0 ? doc.y : undefined));
};

const addVisitData = (
  doc: PDFDoc,
  x: number,
  y: number,
  visitIdTitle: string,
  texts: LocalizedVisitData,
  secondaryTexts: LocalizedVisitData | undefined,
  data: IPDFData
): void => {
  const visitInfoRows: ITitleValueRow[] = [
    { title: visitIdTitle, value: data.visitId },
    { title: texts.project, secondaryTitle: secondaryTexts?.project, value: data.projectAcronym },
    {
      title: texts.measurementDate,
      secondaryTitle: secondaryTexts?.measurementDate,
      value: format(data.measurementDate, DATE_FORMAT),
    },
  ];

  // Add phantom row if the visit is phantom
  if (data.isPhantom) {
    visitInfoRows.push(
      { title: texts.phantom, value: texts.phantomYes, isRowBold: true },
      { title: texts.phantomFinalizedBy, value: `${data.operatorFinalizer.name} ${data.operatorFinalizer.surname}` }
    );
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
    .text(`${texts.safetyInfo.textPart1} ${texts.safetyInfo.textPart2}`, {
      indent: PARAGRAPH_INDENT,
      align: "justify",
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    });
};

const doesQuestionFitOnPage = (
  doc: PDFDoc,
  questionAnswerText: string,
  questionAnswerSecondaryText: string | undefined,
  comment: string | undefined
): boolean => {
  let textHeight = doc.font(REGULAR_FONT, TEXT_FONT_SIZE).heightOfString(questionAnswerText);

  if (questionAnswerSecondaryText) {
    textHeight += doc.font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE).heightOfString(questionAnswerSecondaryText);
  }

  if (comment) {
    textHeight += doc.font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE).heightOfString(comment);
  }

  return textHeight <= doc.page.height - doc.y - doc.page.margins.bottom;
};

const addQuestions = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedQuestions,
  secondaryTexts: LocalizedQuestions | undefined,
  questions: IPDFQuestionAnswer[]
): void => {
  addBlockTitle(doc, x, y, CHAPTER_FONT_SIZE, GAP_AFTER_CHAPTER_TITLE, texts.title, secondaryTexts?.title);
  questions.forEach(({ questionText, questionSecondaryText, answer, comment }) => {
    const answerText = (answer === AnswerOption.YES ? texts.answerYes : texts.answerNo).toUpperCase();
    const answerSecondaryText = (
      answer === AnswerOption.YES ? secondaryTexts?.answerYes : secondaryTexts?.answerNo
    )?.toUpperCase();
    const commentText = comment
      ? secondaryTexts
        ? `${texts.comment} (${secondaryTexts.comment}): ${comment}`
        : `${texts.comment}: ${comment}`
      : undefined;

    if (
      !doesQuestionFitOnPage(
        doc,
        `${questionText} ${answerText}`,
        questionSecondaryText && answerSecondaryText ? `${questionSecondaryText} ${answerSecondaryText}` : undefined,
        comment
      )
    ) {
      doc.addPage();
    }

    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${questionText} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
      .font(MEDIUM_FONT, TEXT_FONT_SIZE)
      .text(answerText, { paragraphGap: questionSecondaryText || comment ? SECONDARY_TEXT_GAP : INPUT_ROWS_GAP });

    if (questionSecondaryText && answerSecondaryText) {
      doc
        .font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE)
        .text(`(${questionSecondaryText} `, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
        .font(MEDIUM_FONT)
        .text(answerSecondaryText, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, continued: true })
        .font(REGULAR_FONT)
        .text(")", { paragraphGap: comment ? 2 : INPUT_ROWS_GAP });
    }

    if (commentText) {
      doc.font(REGULAR_FONT, SECONDARY_TEXT_FONT_SIZE).text(commentText, {
        align: "justify",
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
        paragraphGap: INPUT_ROWS_GAP,
      });
    }
  });
};

const addBeforeExaminationInfo = (doc: PDFDoc, x: number, y: number, texts: LocalizedBeforeExaminationInfo): void => {
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(
      `${texts.textPart1} ${texts.textPart2} ${texts.textPart3} ${texts.textPart4}, ${texts.textPart5} ${texts.textPart6} ${texts.textPart7}`,
      x,
      y,
      {
        align: "justify",
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
      }
    );
};

const addExaminationConsent = (
  doc: PDFDoc,
  x: number,
  y: number,
  commonTexts: CommonExaminationConsent,
  texts: LocalizedExaminationConsent,
  secondaryTexts: LocalizedExaminationConsent | undefined,
  data: IPDFData
): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, x, y, {
    align: "center",
    lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    paragraphGap: GAP_AFTER_HEADING_TITLE,
  });
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(texts.text1, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: TEXT_PARAGRAPHS_GAP });
  doc.text(texts.text2, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: TEXT_PARAGRAPHS_GAP });
  doc
    .text(`${texts.contactDetailsTitle}:`, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.contactDetails, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(`${texts.contactPerson}: ${commonTexts.contactPerson}`, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(`${texts.phone}: ${commonTexts.phone}`, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(`${texts.email}: ${commonTexts.mafilEmail}`, {
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
      paragraphGap: TEXT_PARAGRAPHS_GAP,
    });

  doc
    .text(`${texts.text3}:`, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.personalInfoProtectionSite, { paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS });

  if (secondaryTexts) {
    doc.addPage();
  }

  const titleTextGap = 4;
  const inBrnoOnText = `${texts.inBrnoDate}: ${IN_BRNO_ON_DASHES}`;
  const signatureText = `${texts.signature}: ${SIGNATURE_DASHES}`;

  addBlockTitle(
    doc,
    doc.x,
    doc.y,
    CHAPTER_FONT_SIZE,
    titleTextGap,
    texts.studyParticipantTitle,
    secondaryTexts?.studyParticipantTitle
  );
  doc.font(REGULAR_FONT, TEXT_FONT_SIZE);

  if (secondaryTexts) {
    const secondarySignatureTextX = doc.page.width - doc.page.margins.right - doc.widthOfString(signatureText);
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${texts.firstAndLastName}: ${data.name} ${data.surname}`, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.firstAndLastName})`, { lineGap: GAP_AROUND_SIGNATURE_BLOCKS })
      .fontSize(TEXT_FONT_SIZE)
      .text(inBrnoOnText, { continued: true })
      .text(signatureText, { align: "right", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.inBrnoDate})`)
      .moveUp()
      .text(`(${secondaryTexts.signature})`, secondarySignatureTextX, undefined, {
        paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS,
      });
  } else {
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${texts.firstAndLastName}: ${data.name} ${data.surname}`, { lineGap: GAP_AROUND_SIGNATURE_BLOCKS })
      .text(inBrnoOnText, { continued: true })
      .text(signatureText, { align: "right", paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS });
  }

  addBlockTitle(
    doc,
    x,
    doc.y,
    CHAPTER_FONT_SIZE,
    titleTextGap,
    texts.laboratoryStaffTitle,
    secondaryTexts?.laboratoryStaffTitle
  );
  doc.font(REGULAR_FONT, TEXT_FONT_SIZE);

  if (secondaryTexts) {
    const secondarySignatureTextX = doc.page.width - doc.page.margins.right - doc.widthOfString(signatureText);
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(texts.laboratoryStaffText, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.laboratoryStaffText})`, {
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
        paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS,
      })
      .fontSize(TEXT_FONT_SIZE)
      .text(`${texts.firstAndLastName}: ${data.operatorFinalizer.name} ${data.operatorFinalizer.surname}`, {
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
      })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.firstAndLastName})`, { lineGap: GAP_AROUND_SIGNATURE_BLOCKS })
      .fontSize(TEXT_FONT_SIZE)
      .text(inBrnoOnText, { continued: true })
      .text(signatureText, { align: "right", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.inBrnoDate})`)
      .moveUp()
      .text(`(${secondaryTexts.signature})`, secondarySignatureTextX, undefined, {
        paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS,
      });
  } else {
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(texts.laboratoryStaffText, {
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
        paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS,
      })
      .text(`${texts.firstAndLastName}: ${data.operatorFinalizer.name} ${data.operatorFinalizer.surname}`, {
        lineGap: GAP_AROUND_SIGNATURE_BLOCKS,
      })
      .text(inBrnoOnText, { continued: true })
      .text(signatureText, {
        align: "right",
        paragraphGap: data.operatorApprover ? GAP_AROUND_SIGNATURE_BLOCKS : undefined,
      });
  }

  if (data.operatorApprover) {
    doc
      .font(REGULAR_FONT, TEXT_FONT_SIZE)
      .text(`${texts.approverText}: ${data.operatorApprover?.name} ${data.operatorApprover?.surname}`, x, undefined, {
        lineGap: LINE_GAP_INSIDE_PARAGRAPH,
      });

    if (secondaryTexts) {
      doc.fontSize(SECONDARY_TEXT_FONT_SIZE).text(`(${secondaryTexts.approverText})`);
    }
  }
};

const addProbandContactRequest = (
  doc: PDFDoc,
  x: number,
  y: number,
  texts: LocalizedProbandContactRequest,
  data: IPDFData
): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, x, y, {
    align: "center",
    lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    paragraphGap: GAP_AFTER_HEADING_TITLE,
  });
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(
      `${texts.text1Part1}, ${data.name} ${data.surname}, ${texts.text1Part2} ${format(data.birthdate, DATE_FORMAT)}, ${
        texts.text2
      } ${format(data.measurementDate, DATE_FORMAT)} ${texts.text3}:`,
      { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: TEXT_PARAGRAPHS_GAP }
    );
  doc
    .font(MEDIUM_FONT, TEXT_FONT_SIZE)
    .text(texts.emailAddress, { continued: true })
    .font(REGULAR_FONT)
    .text(` (${texts.emailAddressInfo}): ${data.email}`, { lineGap: TEXT_PARAGRAPHS_GAP });
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
  commonTexts: CommonProbandContactConsent,
  texts: LocalizedProbandContactConsent,
  secondaryTexts: LocalizedProbandContactConsent | undefined
): void => {
  doc.font(MEDIUM_FONT, HEADING_FONT_SIZE).text(texts.title, x, y, {
    align: "center",
    lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    paragraphGap: GAP_AFTER_HEADING_TITLE,
  });
  doc
    .font(REGULAR_FONT, TEXT_FONT_SIZE)
    .text(texts.text1, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: TEXT_PARAGRAPHS_GAP });
  doc
    .text(texts.text2, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.text3, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: TEXT_PARAGRAPHS_GAP });
  doc.text(texts.text4, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: TEXT_PARAGRAPHS_GAP });
  doc.text(texts.list, { align: "justify", lineGap: LINE_GAP_INSIDE_PARAGRAPH, paragraphGap: 4 });
  // List bullet indentation doesn't work
  doc.list(
    [
      `${texts.listItem1} ${commonTexts.mafilEmail},`,
      `${texts.listItem2},`,
      `${texts.listItem3},`,
      `${texts.listItem4},`,
    ],
    {
      listType: "bullet",
      bulletRadius: LIST_BULLET_RADIUS,
      align: "justify",
      baseline: LIST_BASELINE,
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    }
  );
  // Workaround: the last list item must be added separately to create gap under the list
  doc.list([`${texts.listItem5Part1} ${texts.listItem5UoouSite} ${texts.listItem5Part2} ${commonTexts.uoouEmail}.`], {
    listType: "bullet",
    bulletRadius: LIST_BULLET_RADIUS,
    align: "justify",
    baseline: LIST_BASELINE,
    lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    paragraphGap: TEXT_PARAGRAPHS_GAP,
  });

  doc
    .text(`${texts.text5Part1} ${commonTexts.trusteeEmail}.`, {
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
    .text(".", { paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS });

  if (secondaryTexts) {
    doc
      .text(`${texts.inBrnoOn} ${IN_BRNO_ON_DASHES}`, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.inBrnoOn})`, { paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS });
    doc
      .fontSize(TEXT_FONT_SIZE)
      .text(SIGNATURE_DASHES, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .text(texts.signature, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
      .fontSize(SECONDARY_TEXT_FONT_SIZE)
      .text(`(${secondaryTexts.signature})`);
    return;
  }

  doc.text(`${texts.inBrnoOn} ${IN_BRNO_ON_DASHES}`, { paragraphGap: GAP_AROUND_SIGNATURE_BLOCKS });
  doc.text(SIGNATURE_DASHES, { lineGap: LINE_GAP_INSIDE_PARAGRAPH }).text(texts.signature);
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
  const doc = new PDFDocument({
    size: "A4",
    margin: PAGE_MARGIN,
    info: {
      Title: `Visit ${data.visitId}`,
      Author: "MAFIL",
      Keywords: "visit",
    },
  });

  // Setup Base64 stream
  const stream = doc.pipe(new Base64Encode());

  // TODO: delete - only for development purpose
  const pdfFile = fs.createWriteStream(`output_${Date.now()}.pdf`);
  doc.pipe(pdfFile);

  // Register and use Roboto font family that supports UNICODE characters
  doc.registerFont(REGULAR_FONT, getFontPath("roboto/Roboto-Regular.ttf"));
  doc.registerFont(MEDIUM_FONT, getFontPath("roboto/Roboto-Medium.ttf"));

  // Set default line gap in the document
  doc.lineGap(DEFAULT_DOC_LINE_GAP);

  // Add Visit ID on every new page (except the first one)
  doc.on("pageAdded", () => onNewPageAdded(doc, commonTexts.visitId, data.visitId));

  // Add MAFIL logo
  const imageWidth = 90;
  doc.image(getImagePath("mafil_brain_logo.png"), { width: imageWidth });
  const onMafilLogoRightContentX = imageWidth + 110;
  const linePositionUnderImage = doc.y;

  // Add MAFIL info
  doc
    .font(MEDIUM_FONT, CHAPTER_FONT_SIZE)
    .text(commonTexts.mafil.ceitec, onMafilLogoRightContentX, doc.page.margins.top + 30, {
      lineGap: LINE_GAP_INSIDE_PARAGRAPH,
    })
    .text(texts.pdf.mafil.name, { lineGap: LINE_GAP_INSIDE_PARAGRAPH })
    .text(texts.pdf.mafil.workplace);

  // Add visit information
  addVisitData(
    doc,
    doc.page.margins.left,
    linePositionUnderImage + 30,
    commonTexts.visitId,
    texts.pdf.visitData,
    secondaryTexts?.pdf.visitData,
    data
  );

  // Add proband information
  addPersonalData(
    doc,
    doc.page.margins.left,
    doc.y + GAP_BEFORE_CHAPTER,
    texts.pdf.personalData,
    secondaryTexts?.pdf.personalData,
    data
  );

  if (!data.isPhantom) {
    // Add entry info
    addEntryInfo(doc, doc.page.margins.left, doc.y + GAP_BEFORE_CHAPTER, texts);

    // Compute whether there's enough space for some question, otherwise place questions on the new page
    let questionsY = doc.y + GAP_BEFORE_CHAPTER;
    if (doc.y + GAP_BEFORE_CHAPTER + 50 > doc.page.height - (doc.page.margins.top + doc.page.margins.bottom)) {
      doc.addPage();
      questionsY = doc.y;
    }

    // Add safety questions
    addQuestions(
      doc,
      doc.page.margins.left,
      questionsY,
      texts.pdf.questions,
      secondaryTexts?.pdf.questions,
      data.answers
    );

    // Add before examination info
    addBeforeExaminationInfo(doc, doc.page.margins.left, doc.y + GAP_BEFORE_CHAPTER, texts.beforeExamination);

    // Add examination consent
    doc.addPage();
    addExaminationConsent(
      doc,
      doc.page.margins.left,
      doc.y,
      commonTexts.examinationConsent,
      texts.examinationConsent,
      secondaryTexts?.examinationConsent,
      data
    );

    // Add proband contact consent if proband requested sending research results via email and phone
    if (data.email && data.phone) {
      doc.addPage();

      // Request
      addProbandContactRequest(doc, doc.page.margins.left, doc.y, texts.probandContact.request, data);

      // Consent
      addProbandContactConsent(
        doc,
        doc.page.margins.left,
        doc.y + GAP_BEFORE_CHAPTER,
        commonTexts.probandContact.consent,
        texts.probandContact.consent,
        secondaryTexts?.probandContact.consent
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

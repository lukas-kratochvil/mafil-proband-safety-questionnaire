import path from "path";
import commonTexts from "../assets/localization/common.json";
import cs from "../assets/localization/cs.json";

export type LocalizedTextsFile = typeof cs;
export type CommonTextsFile = typeof commonTexts;

const ASSETS_DIR_PATH = path.join(__dirname, "..", "assets");
const LOCALIZATIONS_DIR_PATH = path.join(ASSETS_DIR_PATH, "localization");
const IMAGES_DIR_PATH = path.join(ASSETS_DIR_PATH, "images");
const FONTS_DIR_PATH = path.join(ASSETS_DIR_PATH, "fonts");

const getFilePath = (dirPath: string, fileName: string): string => path.join(dirPath, fileName);

export const getLocalizedTextsFile = (locale: string): LocalizedTextsFile => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(getFilePath(LOCALIZATIONS_DIR_PATH, `${locale}.json`));
};

export const getCommonTextsFile = (): CommonTextsFile => commonTexts;

export const getImagePath = (name: string): string => getFilePath(IMAGES_DIR_PATH, name);

export const getFontPath = (name: string): string => getFilePath(FONTS_DIR_PATH, name);

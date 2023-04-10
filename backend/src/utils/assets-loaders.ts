import path from "path";
import commonTexts from "../assets/localization/common.json";
import cs from "../assets/localization/cs.json";

type LocalizedTextsFile = typeof cs;
type CommonTextsFile = typeof commonTexts;

const ASSETS_DIR_PATH = path.join(__dirname, "..", "assets");
const LOCALIZATIONS_DIR_PATH = path.join(ASSETS_DIR_PATH, "localization");

export const getLocalizedTextsFile = (locale: string): LocalizedTextsFile => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(path.join(LOCALIZATIONS_DIR_PATH, `${locale}.json`));
};

export const getCommonTextsFile = (): CommonTextsFile => commonTexts;

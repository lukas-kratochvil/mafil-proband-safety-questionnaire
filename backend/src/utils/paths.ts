import path from "path";

// Generated files
export const GENERATED_DIR_PATH = path.join(process.cwd(), "generated");
export const GENERATED_PDF_DIR_PATH = path.join(GENERATED_DIR_PATH, "pdf");

// Asset files - mostly used in PDF generation
const ASSETS_DIR_PATH = path.join(process.cwd(), "assets");
export const LOCALIZATIONS_DIR_PATH = path.join(ASSETS_DIR_PATH, "localization");
export const IMAGES_DIR_PATH = path.join(ASSETS_DIR_PATH, "images");
export const FONTS_DIR_PATH = path.join(ASSETS_DIR_PATH, "fonts");

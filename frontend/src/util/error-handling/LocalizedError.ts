export class LocalizedError extends Error {
  readonly localizationKey: string;

  constructor(commonErrorsLocalizationKey: string) {
    super();
    // setting prototype because we are extending a built-in class
    Object.setPrototypeOf(this, LocalizedError.prototype);
    this.localizationKey = `common.errors.${commonErrorsLocalizationKey}`;
  }
}

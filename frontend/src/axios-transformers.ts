import { AxiosResponse } from "axios";
import { parseJSON } from "date-fns";

/**
 * Transforming date strings to dates in the response body. The date is of type string in the response.
 *
 * Code inspired by: https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
 */

// ISO date regex inspired by: https://github.com/RickStrahl/json.date-extensions/blob/master/json.date-extensions.js
const ISO_DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.{0,1}\d*)(?:Z|(\+|-)([\d|:]*))?$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isIsoDateString = (value: any): boolean =>
  value && typeof value === "string" && ISO_DATE_FORMAT_REGEX.test(value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDates = (body: any): any => {
  if (body === null || body === undefined || typeof body !== "object") {
    return body;
  }

  Object.entries(body).forEach(([key, value]) => {
    if (isIsoDateString(value)) {
      // eslint-disable-next-line no-param-reassign
      body[key] = parseJSON(value as string);
    } else if (typeof value === "object") {
      return handleDates(value);
    }

    return body;
  });

  return body;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformDateStringToDate = (response: AxiosResponse<any, any>): AxiosResponse<any, any> => {
  handleDates(response.data);
  return response;
};

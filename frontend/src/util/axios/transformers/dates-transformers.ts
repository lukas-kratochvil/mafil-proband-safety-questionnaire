import type { AxiosResponse } from "axios";
import { parseISO } from "date-fns";

/**
 * Transforming date strings to dates in the response body. The date is of type string in the response.
 *
 * Code inspired by: https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
 */

/**
 * ISO 8601 date regex
 * Inspired by: https://github.com/RickStrahl/json.date-extensions/blob/fbb1e65c3f30f90ee03cb0234786cff2f8899e65/json.date-extensions.js#L14
 */
const ISO_8601_DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.{0,1}\d*)(?:Z|(\+|-)([\d|:]*))?)?$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isIso8601DateString = (value: any): boolean =>
  value && typeof value === "string" && ISO_8601_DATE_FORMAT_REGEX.test(value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDates = <T>(body: any, transform: (value: string) => T): any => {
  if (body === null || body === undefined || typeof body !== "object") {
    return body;
  }

  Object.entries(body).forEach(([key, value]) => {
    if (isIso8601DateString(value)) {
      // eslint-disable-next-line no-param-reassign
      body[key] = transform(value as string);
    } else if (typeof value === "object") {
      return handleDates(value, transform);
    }

    return body;
  });

  return body;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformResponseDateStringToDate = (response: AxiosResponse<any, any>): AxiosResponse<any, any> => {
  handleDates(response.data, parseISO);
  return response;
};

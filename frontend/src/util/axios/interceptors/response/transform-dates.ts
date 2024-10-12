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

const isIso8601DateString = (value: string): boolean => ISO_8601_DATE_FORMAT_REGEX.test(value);

type BodyObject = Record<PropertyKey, unknown> | Array<unknown>;

const handleDates = (body: BodyObject, transform: (value: string) => Date): BodyObject => {
  if (Array.isArray(body)) {
    body.forEach((value, index) => {
      if (value && typeof value === "object") {
        return handleDates(value as BodyObject, transform);
      }

      if (typeof value === "string" && isIso8601DateString(value)) {
        // eslint-disable-next-line no-param-reassign
        body[index] = transform(value);
      }

      return body;
    });
  } else {
    Object.entries(body).forEach(([key, value]) => {
      if (value && typeof value === "object") {
        return handleDates(value as BodyObject, transform);
      }

      if (typeof value === "string" && isIso8601DateString(value)) {
        // eslint-disable-next-line no-param-reassign
        body[key] = transform(value);
      }

      return body;
    });
  }

  return body;
};

/**
 * Transform all date-strings in the response into Date objects.
 */
export const transformDateStringsToDate = (
  response: AxiosResponse<unknown, unknown>
): AxiosResponse<unknown, unknown> => {
  if (response.data && typeof response.data === "object") {
    handleDates(response.data as BodyObject, parseISO);
  }

  return response;
};

import { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { transformRequestDateToDateString, transformResponseDateStringToDate } from "../dates-transformers";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("ISO 8601 dates transformers", () => {
  describe("transform request date to date-string", () => {
    test.each([
      ["1980-05-03T00:20:08.000Z", "1980-05-03"],
      ["2024-05-20T15:29:20+07:00", "2024-05-20"],
      ["2024-10-07T01:20:08.000", "2024-10-07"],
    ])("date: %s", (date, resDate) => {
      const headers = new AxiosHeaders();
      const data = {
        name: "Nick",
        surname: "Wolf",
        date,
        number: 1,
      };
      const request: InternalAxiosRequestConfig = {
        headers,
        data,
      };

      const transformedRequest = transformRequestDateToDateString(request);
      const expectedRequestData = {
        ...data,
        date: resDate,
      };

      expect(transformedRequest.data).toEqual(expectedRequestData);
    });
  });

  describe("transform response date-string to date", () => {
    test.each([
      ["1980-05-03", new Date(1980, 4, 3)],
      ["2024-10-07T01:20:08.000", new Date(2024, 9, 7, 1, 20, 8)],
      // TODO: test cases bellow are timezone dependent
      // ["2024-10-07T03:20:08.000Z", new Date(2024, 9, 7, 5, 20, 8)],
      // ["2015-06-22T13:17:21+02:00", new Date(2015, 5, 22, 13, 17, 21)],
    ])("date-string: %s", (dateString, resDate) => {
      const headers = new AxiosHeaders();
      const data = {
        name: "Nick",
        surname: "Wolf",
        date: dateString,
        number: 1,
      };
      const response: AxiosResponse<typeof data, typeof data> = {
        config: {
          headers,
        },
        headers,
        data,
        status: 200,
        statusText: "Ok",
      };

      const transformedResponse = transformResponseDateStringToDate(response);
      const expectedResponseData = {
        ...data,
        date: resDate,
      };

      expect(transformedResponse.data).toEqual(expectedResponseData);
    });
  });
});

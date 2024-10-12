import { AxiosHeaders, type AxiosResponse } from "axios";
import { transformDateStringsToDate } from "../transform-dates";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("ISO 8601 dates transformers", () => {
  describe("transform response date-string to date - object data type", () => {
    test.each([
      ["1980-05-03", new Date(1980, 4, 3)],
      ["2024-10-07T01:20:08.000", new Date(2024, 9, 7, 1, 20, 8)],
    ])("date-string: %s", (dateString, resDate) => {
      const headers = new AxiosHeaders();
      const data = {
        name: "Nick",
        surname: "Wolf",
        something: null,
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

      const transformedResponse = transformDateStringsToDate(response);
      const expectedResponseData = {
        ...data,
        date: resDate,
      };

      expect(transformedResponse.data).toEqual(expectedResponseData);
    });
  });

  describe("transform response date-string to date - array data type", () => {
    test.each([
      ["1980-05-03", new Date(1980, 4, 3)],
      ["2024-10-07T01:20:08.000", new Date(2024, 9, 7, 1, 20, 8)],
    ])("date-string: %s", (dateString, resDate) => {
      const headers = new AxiosHeaders();
      const data = {
        name: "Nick",
        surname: "Wolf",
        something: null,
        results: [
          {
            date: dateString,
            something: null,
            number: 1,
          },
          {
            date: dateString,
            something: null,
            number: 2,
          },
        ],
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

      const transformedResponse = transformDateStringsToDate(response);
      const expectedResponseData = {
        ...data,
        results: data.results.map((result) => ({
          ...result,
          date: resDate,
        })),
      };

      expect(transformedResponse.data).toEqual(expectedResponseData);
    });
  });
});

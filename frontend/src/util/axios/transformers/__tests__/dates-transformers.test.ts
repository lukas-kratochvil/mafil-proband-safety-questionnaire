import { AxiosHeaders, type AxiosResponse } from "axios";
import { transformResponseDateStringToDate } from "../dates-transformers";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("ISO 8601 dates transformers", () => {
  describe("transform response date-string to date", () => {
    test.each([
      ["1980-05-03", new Date(1980, 4, 3)],
      ["2024-10-07T01:20:08.000", new Date(2024, 9, 7, 1, 20, 8)],
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

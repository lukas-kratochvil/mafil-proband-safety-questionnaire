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

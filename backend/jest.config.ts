import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/$1",
    "@assets/(.*)": "<rootDir>/assets/$1",
  },
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};

export default config;

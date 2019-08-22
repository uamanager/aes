module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "collectCoverage": true,
  "coveragePathIgnorePatterns": ["/node_modules/", "/tests/"],
  "coverageReporters": ["text", "text-summary", "clover"],
  "reporters": ["default", "jest-junit"],
  "verbose": true
};

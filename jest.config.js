module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  modulePaths: ["app/javascript"],
  testMatch: ["<rootDir>/**/*.spec.*"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};

const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');

const rootPath = path.resolve(__dirname, '../..'); 

test('Metro config should include .sql extension', () => {
  const config = getDefaultConfig(rootPath);
  console.log(config.resolver.sourceExts);
  expect(config.resolver.sourceExts).toContain("js");
});

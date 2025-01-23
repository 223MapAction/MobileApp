import schema from '../db/schema.ts';
describe('Configuration Files', () => {
  it('devrait avoir la bonne configuration drizzle', () => {
    const drizzleConfig = require('../drizzle.config.js');
    expect(drizzleConfig).toEqual({
      schema: "../db/schema.ts",
      out: "../drizzle",
      dialect: "sqlite",
      driver: "expo",
    });
  });

  it('devrait avoir la bonne configuration metro', () => {
    const metroConfig = require('../../metro.config.js');
    expect(metroConfig.resolver.sourceExts).toContain('sql');
  });

  it('devrait avoir la bonne configuration react-native', () => {
    const rnConfig = require('../../react-native.config.js');
    expect(rnConfig.assets).toEqual(['../../assets/fonts']);
  });
}); 
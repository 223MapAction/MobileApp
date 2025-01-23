describe('Drizzle Configuration', () => {
  it('devrait avoir la configuration correcte', () => {
    const drizzleConfig = require('../../drizzle.config.js');
    
    expect(drizzleConfig).toEqual({
      schema: "../db/schema.ts",
      out: "../drizzle",
      dialect: "sqlite",
      driver: "expo",
    });
  });

  it('devrait avoir tous les champs requis', () => {
    const drizzleConfig = require('../../drizzle.config.js');
    
    expect(drizzleConfig).toHaveProperty('schema');
    expect(drizzleConfig).toHaveProperty('out');
    expect(drizzleConfig).toHaveProperty('dialect');
    expect(drizzleConfig).toHaveProperty('driver');
  });
}); 
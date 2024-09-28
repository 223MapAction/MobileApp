/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
};

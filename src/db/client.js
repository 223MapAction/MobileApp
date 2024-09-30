import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

const expoDb = openDatabaseSync("incidentReports.db", {
  useNewConnection: true,
});

export const db = drizzle(expoDb);

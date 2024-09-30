import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey(),
  title: text("title"),
  zone: text("zone"),
  description: text("description"),
  photo: text("photo"),
  video: text("video"),
  audio: text("audio"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  etat: text("etat"),
  slug: text("slug"),
  user_id: integer("user_id"),
  category_id: integer("category_id"),
  indicateur_id: integer("indicateur_id"),
  taken_by: integer("taken_by"),
  category_ids: text("category_ids"),
  status: text("status").default("pending"),
});

// Type inference for selecting reports
export type SelectReport = typeof reports.$inferSelect;

// createdAt: text("created_at")
//     .default(sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`)
//     .notNull(),
//   updatedAt: text("updated_at")
//     .default(sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`)
//     .notNull()
//     .$onUpdate(() => sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`),

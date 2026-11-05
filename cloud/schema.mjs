import { pgTable, uuid, text, integer, boolean, timestamp, primaryKey, index } from "drizzle-orm/pg-core";

export const documents = pgTable("study_documents", {
  id: uuid("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  origin: text("origin").notNull(),
  theme: text("theme").notNull(),
  closed: boolean("closed").notNull().default(false),
  version: integer("version").notNull(),
  objectKey: text("object_key").notNull(),
  digest: text("digest").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, table => [index("study_documents_owner").on(table.ownerId, table.id)]);

export const revisions = pgTable("study_revisions", {
  documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  name: text("name").notNull(),
  objectKey: text("object_key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, table => [primaryKey({ columns: [table.documentId, table.version] })]);

export const sessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }).notNull(),
  durationMs: integer("duration_ms").notNull(),
  technique: text("technique").notNull()
}, table => [index("study_sessions_owner").on(table.ownerId, table.finishedAt, table.id)]);

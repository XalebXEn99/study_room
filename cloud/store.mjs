import { createHash, randomUUID } from "node:crypto";
import { and, or, eq, gt, lt, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { documents, revisions, sessions } from "./schema.mjs";
import { HttpError } from "./api.mjs";

export function createStore(pool, objects) {
  const db = drizzle(pool);
  const owned = (ownerId, id) => and(eq(documents.id, id), eq(documents.ownerId, ownerId));
  const metadata = row => ({
    id: row.id, name: row.name, origin: row.origin, theme: row.theme,
    closed: row.closed, version: row.version, updatedAt: row.updatedAt
  });
  async function find(ownerId, id) {
    const [row] = await db.select().from(documents).where(owned(ownerId, id));
    if (!row) throw new HttpError(404, "Document not found.");
    return row;
  }
  return {
    async list(ownerId, after) {
      const rows = await db.select().from(documents)
        .where(and(eq(documents.ownerId, ownerId), after ? gt(documents.id, after) : undefined))
        .orderBy(asc(documents.id)).limit(101);
      return { items: rows.slice(0, 100).map(metadata), next: rows.length > 100 ? rows[99].id : null };
    },
    async read(ownerId, id, version) {
      const row = await find(ownerId, id);
      let selected = row;
      if (version) {
        [selected] = await db.select().from(revisions)
          .where(and(eq(revisions.documentId, id), eq(revisions.version, version)));
        if (!selected) throw new HttpError(404, "Revision not found.");
      }
      return { ...metadata(row), name: selected.name, raw: await objects.read(selected.objectKey), revision: selected.version };
    },
    async history(ownerId, id, before) {
      await find(ownerId, id);
      const rows = await db.select({
        version: revisions.version, name: revisions.name, createdAt: revisions.createdAt
      }).from(revisions).where(and(eq(revisions.documentId, id), before ? lt(revisions.version, before) : undefined))
        .orderBy(desc(revisions.version)).limit(51);
      return { items: rows.slice(0, 50), next: rows.length > 50 ? rows[49].version : null };
    },
    async save(ownerId, id, input) {
      let uploadedKey;
      try {
        return await db.transaction(async tx => {
          // Serialize even the first insert, so retries cannot produce two version ones.
          await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${id}, 0))`);
          const [current] = await tx.select().from(documents).where(eq(documents.id, id)).for("update");
          if (current && current.ownerId !== ownerId) throw new HttpError(404, "Document not found.");
          const digest = createHash("sha256").update(input.raw).digest("hex");
          if (current && current.version !== input.version && current.digest === digest &&
              current.name === input.name && current.origin === input.origin &&
              current.theme === input.theme && current.closed === input.closed) return metadata(current);
          if ((current?.version || 0) !== input.version) {
            throw new HttpError(409, "This file changed on another device. Download your current edits, then reload before saving.");
          }
          const changed = !current || current.digest !== digest || current.name !== input.name;
          const version = (current?.version || 0) + (changed ? 1 : 0);
          const objectKey = changed ? `users/${ownerId}/${id}/${randomUUID()}.md` : current.objectKey;
          if (changed) {
            uploadedKey = objectKey;
            await objects.write(objectKey, input.raw);
          }
          const values = {
            id, ownerId, name: input.name, origin: input.origin, theme: input.theme, closed: input.closed,
            version, objectKey, digest, updatedAt: new Date()
          };
          if (current) await tx.update(documents).set(values).where(owned(ownerId, id));
          else await tx.insert(documents).values(values);
          if (changed) await tx.insert(revisions).values({ documentId: id, version, name: input.name, objectKey });
          return metadata(values);
        });
      } catch (error) {
        if (uploadedKey) {
          try { await objects.remove(uploadedKey); }
          catch (cleanupError) { console.error("Could not remove an uncommitted study object:", cleanupError); }
        }
        throw error;
      }
    },
    async sessions(ownerId, before) {
      const rows = await db.select({
        id: sessions.id, startedAt: sessions.startedAt, finishedAt: sessions.finishedAt,
        durationMs: sessions.durationMs, technique: sessions.technique
      }).from(sessions).where(and(eq(sessions.ownerId, ownerId), before ? or(
        lt(sessions.finishedAt, before.finishedAt),
        and(eq(sessions.finishedAt, before.finishedAt), lt(sessions.id, before.id))
      ) : undefined)).orderBy(desc(sessions.finishedAt), desc(sessions.id)).limit(51);
      return {
        items: rows.slice(0, 50),
        next: rows.length > 50 ? rows[49].finishedAt.toISOString() + "," + rows[49].id : null
      };
    },
    async addSession(ownerId, session) {
      await db.insert(sessions).values({ ...session, ownerId }).onConflictDoNothing();
    }
  };
}

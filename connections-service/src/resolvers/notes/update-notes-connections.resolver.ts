import { Driver, Session } from "neo4j-driver";
import { CreateNoteTagConnectionInput } from "../../schema/schema";

/**
 * @param driver
 * @param args
 * @returns
 * @example
 * ```ts
 * await resolveUpdateNotesConnections(driver, {
 *   args: {
 *     notes: [
 *       {
 *         id: 'note-1',
 *         name: 'Shopping List',
 *         tags: [
 *           { id: 'tag-1', name: 'personal' },
 *           { id: 'tag-2', name: 'errands' },
 *         ],
 *       },
 *       {
 *         id: 'note-2',
 *         name: 'Project Ideas',
 *         tags: [
 *           { id: 'tag-3', name: 'work' },
 *           { id: 'tag-4', name: 'creative' },
 *         ],
 *       },
 *     ],
 *   },
 * });
 * ```
 */
export async function resolveUpdateNotesConnections(
  driver: Driver,
  args: CreateNoteTagConnectionInput,
) {
  const cypher = `
    UNWIND $notes AS noteData
    MERGE (n:Note {name: noteData.name})
    SET n.id = noteData.id
    WITH n, noteData
    UNWIND noteData.tags AS tagData
    MERGE (t:Tag {name: tagData.name})
    SET t.id = tagData.id
    MERGE (n)-[:TAGGED_WITH]->(t)
    MERGE (t)-[:TAGS]->(n)
  `;

  const session: Session = driver.session();
  try {
    const result = await session.run(cypher, { notes: args.notes });
    return result.records.map((record) => record.toObject());
  } finally {
    await session.close();
  }
}

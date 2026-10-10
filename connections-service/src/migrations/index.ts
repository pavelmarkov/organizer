const constraint_note_name_unique = `CREATE CONSTRAINT note_name_unique IF NOT EXISTS
            FOR (n:Note) REQUIRE n.name IS UNIQUE`;

const constraint_tag_name_unique = `CREATE CONSTRAINT tag_name_unique IF NOT EXISTS
            FOR (t:Tag) REQUIRE t.name IS UNIQUE`;

export const SCHEMA_MIGRATIONS = [
  constraint_note_name_unique,
  constraint_tag_name_unique,
];

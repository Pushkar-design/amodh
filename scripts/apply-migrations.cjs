/**
 * Applies all supabase/migrations/*.sql in sorted order via Postgres DATABASE_URL.
 * Preferred workflow for this repo: apply the same files with Supabase MCP (apply_migration) or
 * SQL Editor — no DATABASE_URL needed. This script is an optional local fallback.
 */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "Missing DATABASE_URL.\n" +
      "Recommended: use Supabase MCP in Cursor to run apply_migration with SQL from supabase/migrations/,\n" +
      "or paste that SQL in Supabase Dashboard → SQL Editor.\n" +
      "Optional: add DATABASE_URL to .env.local (Connect → URI + DB password), then: npm run db:migrate"
  );
  process.exit(1);
}

const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");

async function main() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No .sql files in supabase/migrations.");
    return;
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    for (const f of files) {
      const full = path.join(migrationsDir, f);
      const sql = fs.readFileSync(full, "utf8");
      console.log("Applying:", f);
      await client.query(sql);
    }
    console.log("Done. Applied", files.length, "migration(s).");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

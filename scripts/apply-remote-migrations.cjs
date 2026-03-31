/**
 * Applies supabase/complete-setup.sql using Postgres DATABASE_URL (optional local fallback).
 * Preferred: Supabase MCP apply_migration / SQL Editor with complete-setup.sql or migrations/*.sql.
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
      "Recommended: use Supabase MCP (apply_migration) or paste supabase/complete-setup.sql in SQL Editor.\n" +
      "Optional: add DATABASE_URL to .env.local, then run npm run db:apply again."
  );
  process.exit(1);
}

const sqlPath = path.join(__dirname, "..", "supabase", "complete-setup.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied: supabase/complete-setup.sql (rooms, bookings, settings, seed data, RLS).");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

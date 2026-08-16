/**
 * Turso に skills 系テーブルが無い環境向けのガード。
 * drizzle-kit push が temporal-polyfill で落ちる場合の保険。
 */
import db from "../src/infrastructure/drizzle/db";

const statements = [
  `CREATE TABLE IF NOT EXISTS techs_table (
    tech_id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    created_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    updated_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS skills_table (
    skill_id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    language text NOT NULL,
    experience_months integer NOT NULL,
    level integer NOT NULL,
    detail text NOT NULL,
    created_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    updated_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_table(user_id)
  )`,
  `CREATE TABLE IF NOT EXISTS skill_techs_table (
    skill_tech_id text PRIMARY KEY NOT NULL,
    skill_id text NOT NULL,
    tech_id text NOT NULL,
    created_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    updated_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    FOREIGN KEY (skill_id) REFERENCES skills_table(skill_id),
    FOREIGN KEY (tech_id) REFERENCES techs_table(tech_id)
  )`,
];

for (const statement of statements) {
  await db.$client.execute(statement);
}

console.log("skills schema ensured");

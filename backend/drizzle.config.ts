import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./migrations",
    schema: [
        "./src/features/users/drizzle/schema.ts",
        "./src/features/skills/drizzle/schema.ts",
        "./src/features/books/drizzle/schema.ts",
        "./src/features/projects/drizzle/schema.ts",
    ],
    dialect: "sqlite",
});

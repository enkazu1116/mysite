import { eq } from "drizzle-orm";
import db from "../../infrastructure/drizzle/db";
import { usersTable } from "../../infrastructure/drizzle/schema";
import type {
    CreateUserInput,
    UpdateUserInput,
} from "./validation/userValidation";

export type { CreateUserInput, UpdateUserInput };

export async function createUser(input: CreateUserInput) {
    const [user] = await db.insert(usersTable).values(input).returning();
    return user ?? null;
}

export async function findUserById(userId: string) {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.user_id, userId));

    return user ?? null;
}

export async function listUsers() {
    return db.select().from(usersTable);
}

export async function updateUser(userId: string, input: UpdateUserInput) {
    const [user] = await db
        .update(usersTable)
        .set({
            ...input,
            updated_at: new Date(),
        })
        .where(eq(usersTable.user_id, userId))
        .returning();

    return user ?? null;
}

export async function deleteUser(userId: string) {
    const [user] = await db
        .delete(usersTable)
        .where(eq(usersTable.user_id, userId))
        .returning();

    return user ?? null;
}

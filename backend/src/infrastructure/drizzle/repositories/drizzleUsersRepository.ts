import { eq } from "drizzle-orm";
import type { UsersRepository } from "../../../features/users/repositories/usersRepository";
import type { UserRecord } from "../../../features/users/types/usersModel";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import db from "../db";
import { usersTable } from "../schema";

type UserRow = typeof usersTable.$inferSelect;

function mapRow(row: UserRow): UserRecord {
    return {
        id: row.user_id as UUID,
        name: row.user_name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

class DrizzleUsersRepository implements UsersRepository {
    async findByUserId(userId: UUID): Promise<UserRecord | null> {
        const [row] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.user_id, userId));

        return row ? mapRow(row) : null;
    }

    async findByUserName(userName: string): Promise<UserRecord | null> {
        const [row] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.user_name, userName));

        return row ? mapRow(row) : null;
    }

    async findAll(): Promise<UserRecord[]> {
        const rows = await db.select().from(usersTable);
        return rows.map(mapRow);
    }

    async createUser(user: UserRecord): Promise<UserRecord> {
        const [row] = await db
            .insert(usersTable)
            .values({
                user_id: user.id,
                user_name: user.name,
            })
            .returning();

        if (!row) {
            throw new Error("Failed to create user.");
        }

        return mapRow(row);
    }

    async updateUser(user: UserRecord): Promise<UserRecord> {
        const [row] = await db
            .update(usersTable)
            .set({
                user_name: user.name,
                updated_at: user.updatedAt,
            })
            .where(eq(usersTable.user_id, user.id))
            .returning();

        if (!row) {
            throw new Error("User not found.");
        }

        return mapRow(row);
    }

    async deleteUser(userId: UUID): Promise<UserRecord | null> {
        const [row] = await db
            .delete(usersTable)
            .where(eq(usersTable.user_id, userId))
            .returning();

        return row ? mapRow(row) : null;
    }
}

export { DrizzleUsersRepository };

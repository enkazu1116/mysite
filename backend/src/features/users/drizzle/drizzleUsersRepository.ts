import { eq } from "drizzle-orm";
import { userPersistenceMessages } from "../../../util/messages/persistence/users";
import type { UsersRepository } from "../repositories/usersRepository";
import type { UserRow } from "../types/usersModel";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import type { AppDatabase } from "../../../infrastructure/drizzle/db";
import {
    mapUserRow,
    toUserInsertValues,
    toUserUpdateValues,
} from "./usersMapper";
import { usersTable } from "./schema";

class DrizzleUsersRepository implements UsersRepository {
    constructor(private readonly db: AppDatabase) {}

    async findByUserId(userId: UUID): Promise<UserRow | null> {
        const [row] = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.user_id, userId));

        return row ? mapUserRow(row) : null;
    }

    async findByUserName(userName: string): Promise<UserRow | null> {
        const [row] = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.user_name, userName));

        return row ? mapUserRow(row) : null;
    }

    async findAll(): Promise<UserRow[]> {
        const rows = await this.db.select().from(usersTable);
        return rows.map(mapUserRow);
    }

    async createUser(user: UserRow): Promise<UserRow> {
        const [row] = await this.db
            .insert(usersTable)
            .values(toUserInsertValues(user))
            .returning();

        if (!row) {
            throw new Error(userPersistenceMessages.createFailed);
        }

        return mapUserRow(row);
    }

    async updateUser(user: UserRow): Promise<UserRow> {
        const [row] = await this.db
            .update(usersTable)
            .set(toUserUpdateValues(user))
            .where(eq(usersTable.user_id, user.id))
            .returning();

        if (!row) {
            throw new Error(userPersistenceMessages.notFound);
        }

        return mapUserRow(row);
    }

    async deleteUser(userId: UUID): Promise<UserRow | null> {
        const [row] = await this.db
            .delete(usersTable)
            .where(eq(usersTable.user_id, userId))
            .returning();

        return row ? mapUserRow(row) : null;
    }
}

export { DrizzleUsersRepository };

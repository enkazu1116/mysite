import type { UserRow } from "../../../../features/users/types/usersModel";
import type { UUID } from "../../../../util/uuid/uuidBrandedType";
import { usersTable } from "../../schema";

export type UsersTableRow = typeof usersTable.$inferSelect;

function mapUserRow(row: UsersTableRow): UserRow {
    return {
        id: row.user_id as UUID,
        name: row.user_name,
        bio: row.bio ?? null,
        iconUrl: row.icon_url ?? null,
        githubUrl: row.github_url ?? null,
        articleUrl: row.article_url ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function toUserInsertValues(user: UserRow) {
    return {
        user_id: user.id,
        user_name: user.name,
        bio: user.bio,
        icon_url: user.iconUrl,
        github_url: user.githubUrl,
        article_url: user.articleUrl,
    };
}

function toUserUpdateValues(user: UserRow) {
    return {
        user_name: user.name,
        bio: user.bio,
        icon_url: user.iconUrl,
        github_url: user.githubUrl,
        article_url: user.articleUrl,
        updated_at: user.updatedAt,
    };
}

export { mapUserRow, toUserInsertValues, toUserUpdateValues };

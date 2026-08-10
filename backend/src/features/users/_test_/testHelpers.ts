import { mock } from "bun:test";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import type { UsersRepository } from "../repositories/usersRepository";
import type { UserRow } from "../types/usersModel";
import { defaultUser } from "./fixtures";

/**
 * UsersRepository のモック
 */
function createMockUsersRepository(
    replacements: Partial<UsersRepository> = {},
): UsersRepository {
    return {
        /**
         * デフォルトユーザーの検索のみをモックする。
         * 今回、ユーザーは初期想定では1人のため
         */
        findAll: mock(() => Promise.resolve([defaultUser])),
        
        // 単一のユーザー検索
        findByUserId: mock((userId: UUID) =>
            Promise.resolve(userId === defaultUser.id ? defaultUser : null),
        ),
        findByUserName: mock((userName: string) =>
            Promise.resolve(userName === defaultUser.name ? defaultUser : null),
        ),

        // DB更新処理のメソッドのモック
        createUser: mock((user: UserRow) => Promise.resolve(user)),
        updateUser: mock((user: UserRow) => Promise.resolve(user)),
        deleteUser: mock((userId: UUID) =>
            Promise.resolve(userId === defaultUser.id ? defaultUser : null),
        ),
        ...replacements,
    };
}

export { createMockUsersRepository, defaultUser };

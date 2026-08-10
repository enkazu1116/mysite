import { Temporal } from "../../../util/temporal/instant";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import type { CreateUserRequest, UpdateUserRequest } from "../types/userInput";
import type { UserRow } from "../types/usersModel";

/** バリデーション 正常系 作成用 */
export const validCreateUserInput: CreateUserRequest = {
    name: "テストユーザー",
    bio: "自己紹介",
    iconUrl: "https://example.com/icon.png",
    githubUrl: "https://github.com/example",
    articleUrl: "https://example.com/articles",
};

/** バリデーション 正常系 更新用（いずれか1フィールド以上） */
export const validUpdateUserInput: UpdateUserRequest = {
    name: "更新後ユーザー",
};

// 固定日時
const fixedInstant = Temporal.Instant.from("2024-01-01T00:00:00Z");

/** UseCase / Routes テスト用の既存ユーザー */
export const defaultUser: UserRow = {
    id: "019ea605-0345-7282-a7e7-92a7787251c6" as UUID,
    name: "テストユーザー",
    bio: "自己紹介",
    iconUrl: "https://example.com/icon.png",
    githubUrl: "https://github.com/example",
    articleUrl: "https://example.com/articles",
    createdAt: fixedInstant,
    updatedAt: fixedInstant,
};

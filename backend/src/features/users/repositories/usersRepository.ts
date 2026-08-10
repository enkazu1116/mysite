import { UUID } from "../../../util/uuid/uuidBrandedType";
import type { UserRow } from "../types/usersModel";

interface UsersRepository {
    /**
     * 指定したユーザー ID に紐づくユーザー情報を取得する。
     *
     * @param userId 検索対象のユーザー ID
     * @returns 指定ユーザーの情報。存在しない場合は null
     */
    findByUserId(userId: UUID): Promise<UserRow | null>;


    /**
     * 指定したユーザー名に紐づくユーザー情報を取得する。
     *
     * @param userName 検索対象のユーザー名
     * @returns 指定ユーザーの情報。存在しない場合は null
     */
    findByUserName(userName: string): Promise<UserRow | null>;

    /**
     * 登録されているすべてのユーザー情報を取得する。
     *
     * @returns ユーザー一覧
     */
    findAll(): Promise<UserRow[]>;
    
    /**
     * ユーザー情報を登録する。
     *
     * @param user 登録対象のユーザー情報
     * @returns 登録後のユーザー情報
     */
    createUser(user: UserRow): Promise<UserRow>;
    
    /**
     * ユーザー情報を更新する。
     *
     * @param user 更新対象のユーザー情報
     * @returns 更新後のユーザー情報
     */
    updateUser(user: UserRow): Promise<UserRow>;
    
    /**
     * ユーザー情報を削除する。
     *
     * @param userId 削除対象のユーザー ID
     */
    deleteUser(userId: UUID): Promise<UserRow | null>;
}

export type { UsersRepository}

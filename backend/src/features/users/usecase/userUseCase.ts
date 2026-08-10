import type { UsersRepository } from "../repositories/usersRepository";
import type { CreateUserRequest, UpdateUserRequest } from "../types/userInput";
import type { UserRow } from "../types/usersModel";
import { generateUuid } from "../../../util/uuid/generateUuid";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import { nowInstant } from "../../../util/temporal/instant";
import {
    validateCreateUserInput,
    validateUpdateUserInput,
} from "../validation/userValidation";

class UserUseCase {

    /**
     * UserUseCaseにリポジトリの依存を注入
     * 
     * @param usersRepository: UsersRepositorys
     */
    constructor(private readonly usersRepository: UsersRepository) {}

    /**
     * User一覧取得
     * 
     * @returns 
     */
    async listUsers(): Promise<UserRow[]> {
        return this.usersRepository.findAll();
    }

    /**
     * ID検索
     * 
     * @param userId 
     * @returns 
     */
    async findUserById(userId: string): Promise<UserRow | null> {
        return this.usersRepository.findByUserId(userId as UUID);
    }

    /**
     * User作成
     * 
     * @param input 
     * @returns 
     */
    async createUser(input: CreateUserRequest): Promise<UserRow> {
        
        // スキーマ検証
        const errors = validateCreateUserInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        // 現在時刻をTemporalで取得する
        const now = nowInstant();

        // リポジトリにデータを保存する
        return this.usersRepository.createUser({
            id: generateUuid(),
            name: input.name,
            bio: input.bio ?? null,
            iconUrl: input.iconUrl ?? null,
            githubUrl: input.githubUrl ?? null,
            articleUrl: input.articleUrl ?? null,
            createdAt: now,
            updatedAt: now,
        });
    }

    /**
     * User更新
     * 
     * @param userId 
     * @param input UpdateUserRequest
     * @returns 成功時: UserRow、失敗時: null
     */
    async updateUser(
        userId: string,
        input: UpdateUserRequest,
    ): Promise<UserRow | null> {

        // スキーマ検証
        const errors = validateUpdateUserInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        // データの重複チェック
        const existing = await this.usersRepository.findByUserId(userId as UUID);
        if (!existing) {
            return null;
        }

        // Repositoryにデータを更新する
        return this.usersRepository.updateUser({
            ...existing,
            name: input.name ?? existing.name,
            bio: input.bio !== undefined ? input.bio : existing.bio,
            iconUrl: input.iconUrl !== undefined ? input.iconUrl : existing.iconUrl,
            githubUrl:
                input.githubUrl !== undefined ? input.githubUrl : existing.githubUrl,
            articleUrl:
                input.articleUrl !== undefined ? input.articleUrl : existing.articleUrl,
            updatedAt: nowInstant(),
        });
    }

    /**
     * User削除
     * 
     * @param userId 
     * @returns 成功時: UserRow、失敗時: null
     */
    async deleteUser(userId: string): Promise<UserRow | null> {
        return this.usersRepository.deleteUser(userId as UUID);
    }
}

export { UserUseCase };

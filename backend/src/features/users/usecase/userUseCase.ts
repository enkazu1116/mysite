import type { UsersRepository } from "../repositories/usersRepository";
import type { CreateUserInput, UpdateUserInput } from "../types/userInput";
import type { UserRecord } from "../types/usersModel";
import { generateUuid } from "../../../util/uuid/generateUuid";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import { nowInstant } from "../../../util/temporal/instant";
import {
    validateCreateUserInput,
    validateUpdateUserInput,
} from "../validation/userValidation";

class UserUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async listUsers(): Promise<UserRecord[]> {
        return this.usersRepository.findAll();
    }

    async findUserById(userId: string): Promise<UserRecord | null> {
        return this.usersRepository.findByUserId(userId as UUID);
    }

    async createUser(input: CreateUserInput): Promise<UserRecord> {
        const errors = validateCreateUserInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        const now = nowInstant();

        return this.usersRepository.createUser({
            id: generateUuid(),
            name: input.name,
            bio: input.bio ?? null,
            iconUrl: input.iconUrl ?? null,
            createdAt: now,
            updatedAt: now,
        });
    }

    async updateUser(
        userId: string,
        input: UpdateUserInput,
    ): Promise<UserRecord | null> {
        const errors = validateUpdateUserInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        const existing = await this.usersRepository.findByUserId(userId as UUID);

        if (!existing) {
            return null;
        }

        return this.usersRepository.updateUser({
            ...existing,
            name: input.name ?? existing.name,
            bio: input.bio !== undefined ? input.bio : existing.bio,
            iconUrl: input.iconUrl !== undefined ? input.iconUrl : existing.iconUrl,
            updatedAt: nowInstant(),
        });
    }

    async deleteUser(userId: string): Promise<UserRecord | null> {
        return this.usersRepository.deleteUser(userId as UUID);
    }
}

export { UserUseCase };

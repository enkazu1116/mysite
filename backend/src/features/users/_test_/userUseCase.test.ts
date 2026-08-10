import { describe, expect, mock, test } from "bun:test";
import { UserUseCase } from "../usecase/userUseCase";
import {
    defaultUser,
    validCreateUserInput,
    validUpdateUserInput,
} from "./fixtures";
import { createMockUsersRepository } from "./testHelpers";

/**
 * UserUseCaseの振る舞いテスト
 */
describe("userUseCase.ts / UserUseCase", () => {
    
    // 検索処理
    describe("検索処理", () => {
        
        // すべてのユーザーを検索
        test("listUsers (正常系)すべてのユーザーを検索", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            const result = await useCase.listUsers();

            expect(repository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([defaultUser]);
        });

        // ID検索
        test("findUserById (正常系)ユーザーIDを指定して検索", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            const result = await useCase.findUserById(defaultUser.id);

            expect(repository.findByUserId).toHaveBeenCalledWith(defaultUser.id);
            expect(result).toEqual(defaultUser);
        });

        // 存在しないIDの検索による失敗
        test("findUserById (異常系)存在しないIDなら null", async () => {
            const repository = createMockUsersRepository({
                findByUserId: mock(() => Promise.resolve(null)),
            });
            const useCase = new UserUseCase(repository);

            const result = await useCase.findUserById("missing-user-id");

            expect(result).toBeNull();
        });
    });

    // 新規追加処理
    describe("新規追加処理", () => {
        test("createUser (正常系)新しいユーザーを作成", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            const result = await useCase.createUser(validCreateUserInput);

            expect(repository.createUser).toHaveBeenCalledTimes(1);
            expect(repository.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: validCreateUserInput.name,
                    bio: validCreateUserInput.bio,
                    iconUrl: validCreateUserInput.iconUrl,
                    githubUrl: validCreateUserInput.githubUrl,
                    articleUrl: validCreateUserInput.articleUrl,
                }),
            );

            // 必須入力のみ作成されたか検証を行う
            expect(result).toEqual(
                expect.objectContaining({
                    name: validCreateUserInput.name,
                }),
            );
        });

        // 任意項目省略時の検証
        test("createUser (正常系)任意項目省略時は null で保存", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            await useCase.createUser({ name: "ユーザー" });

            expect(repository.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "ユーザー",
                    bio: null,
                    iconUrl: null,
                    githubUrl: null,
                    articleUrl: null,
                }),
            );
        });

        test("createUser (異常系)不正な入力時はエラーを投げ、Repositoryを呼び出さない", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            await expect(useCase.createUser({ name: "" })).rejects.toThrow();

            expect(repository.createUser).not.toHaveBeenCalled();
        });
    });

    // 更新処理
    describe("更新処理", () => {
        test("updateUser (正常系)ユーザーを更新", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            const result = await useCase.updateUser(
                defaultUser.id,
                validUpdateUserInput,
            );

            expect(repository.findByUserId).toHaveBeenCalledWith(defaultUser.id);
            expect(repository.updateUser).toHaveBeenCalledTimes(1);
            expect(repository.updateUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: defaultUser.id,
                    name: validUpdateUserInput.name,
                    bio: defaultUser.bio,
                    createdAt: defaultUser.createdAt,
                }),
            );
            expect(result).toEqual(
                expect.objectContaining({
                    name: validUpdateUserInput.name,
                }),
            );

            // 更新日時の取得
            // mockが呼ばれた1回目の時の第一引数を取得し、デフォルトユーザーと同じ型であるとみなす
            const saved = (
                repository.updateUser as ReturnType<typeof mock>
            ).mock.calls[0]?.[0] as typeof defaultUser;
            
            // 更新日時の検証
            expect(saved.updatedAt.toString()).not.toBe(
                defaultUser.updatedAt.toString(),
            );
        });

        // 未指定のフィールドの値はそのまま保存されることを検証
        test("updateUser (正常系)未指定フィールドは既存値のまま", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            await useCase.updateUser(defaultUser.id, { name: "名前だけ変更" });

            expect(repository.updateUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "名前だけ変更",
                    bio: defaultUser.bio,
                    iconUrl: defaultUser.iconUrl,
                    githubUrl: defaultUser.githubUrl,
                    articleUrl: defaultUser.articleUrl,
                }),
            );
        });

        // bio を nullにして初期化する場合を検証
        test("updateUser (正常系)bio を null でクリア", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            await useCase.updateUser(defaultUser.id, { bio: null });

            expect(repository.updateUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    bio: null,
                    name: defaultUser.name,
                }),
            );
        });

        // 存在しないIDを対象とした更新による失敗の検証
        test("updateUser (異常系)存在しないIDなら null で updateUser 未呼び出し", async () => {
            const repository = createMockUsersRepository({
                findByUserId: mock(() => Promise.resolve(null)),
            });
            const useCase = new UserUseCase(repository);

            const result = await useCase.updateUser("missing-user-id", {
                name: "更新後",
            });

            expect(result).toBeNull();
            expect(repository.updateUser).not.toHaveBeenCalled();
        });

        // 更新する値が存在しない場合による失敗の検証
        test("updateUser (異常系)更新する値が存在しない場合はエラーを投げ、Repositoryを呼び出さない", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            await expect(
                useCase.updateUser(defaultUser.id, {}),
            ).rejects.toThrow();

            expect(repository.findByUserId).not.toHaveBeenCalled();
            expect(repository.updateUser).not.toHaveBeenCalled();
        });
    });

    // 削除処理
    describe("削除処理", () => {
        // 正常系の検証
        test("deleteUser (正常系)ユーザーを削除", async () => {
            const repository = createMockUsersRepository();
            const useCase = new UserUseCase(repository);

            const result = await useCase.deleteUser(defaultUser.id);

            expect(repository.deleteUser).toHaveBeenCalledWith(defaultUser.id);
            expect(result).toEqual(defaultUser);
        });

        // 存在しないIDを対象とした削除による失敗の検証
        test("deleteUser (異常系)存在しないIDなら null", async () => {
            const repository = createMockUsersRepository({
                deleteUser: mock(() => Promise.resolve(null)),
            });
            const useCase = new UserUseCase(repository);

            const result = await useCase.deleteUser("missing-user-id");

            expect(result).toBeNull();
        });
    });
});

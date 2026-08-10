import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import {
    defaultUser,
    validCreateUserInput,
    validUpdateUserInput,
} from "./fixtures";

/**
 * UserRoutesの振る舞いテスト
 */
describe("router.ts / userRoutes HTTP エンドポイント", () => {
    
    // リポジトリーの結果モックを用意
    const findAll = mock(() => Promise.resolve([defaultUser]));
    const findByUserId = mock((userId: string) =>
        Promise.resolve(userId === defaultUser.id ? defaultUser : null),
    );
    const createUser = mock((user: typeof defaultUser) => Promise.resolve(user));
    const updateUser = mock((user: typeof defaultUser) => Promise.resolve(user));
    const deleteUser = mock((userId: string) =>
        Promise.resolve(userId === defaultUser.id ? defaultUser : null),
    );

    // userRoutesの型定義を取得
    let userRoutes: typeof import("../router/router").userRoutes;

    // 技術詳細に対してモックを用意
    beforeAll(async () => {
        mock.module(
            "../../../infrastructure/drizzle/repositories/drizzleUsersRepository",
            () => ({
                // モッククラスを作成し、副作用の発生を防ぐ
                DrizzleUsersRepository: class MockDrizzleUsersRepository {
                    findAll = findAll;
                    findByUserId = findByUserId;
                    findByUserName = mock(() => Promise.resolve(null));
                    createUser = createUser;
                    updateUser = updateUser;
                    deleteUser = deleteUser;
                },
            }),
        );

        // 代入
        ({ userRoutes } = await import("../router/router"));
    });

    afterAll(() => {
        mock.restore();
    });

    // デフォルトユーザーをJSONにパース
    const jsonUser = () => JSON.parse(JSON.stringify(defaultUser));

    // すべてのユーザーを検索
    test("GET / (正常系)ユーザー配列を200で返す", async () => {
        findAll.mockClear();

        const response = await userRoutes.request("/");

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ users: [jsonUser()] });
        expect(findAll).toHaveBeenCalledTimes(1);
    });

    // ID検索
    test("GET /:userId (正常系)ユーザーを200で返す", async () => {
        findByUserId.mockClear();

        const response = await userRoutes.request(`/${defaultUser.id}`);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ user: jsonUser() });
        expect(findByUserId).toHaveBeenCalledWith(defaultUser.id);
    });

    // 存在しないIDの検索による失敗
    test("GET /:userId (異常系)存在しないIDの場合は404", async () => {
        const response = await userRoutes.request("/missing-user-id");

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ message: "user not found" });
    });

    // 新規追加処理
    test("POST / (正常系)ユーザーを201で返す", async () => {
        createUser.mockClear();

        const response = await userRoutes.request("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validCreateUserInput),
        });

        expect(response.status).toBe(201);
        const body = await response.json();
        expect(body.user).toEqual(
            expect.objectContaining({
                name: validCreateUserInput.name,
                bio: validCreateUserInput.bio,
            }),
        );
        expect(createUser).toHaveBeenCalledTimes(1);
    });

    // 不正な入力による失敗
    test("POST / (異常系)不正な入力なら400", async () => {
        createUser.mockClear();

        const response = await userRoutes.request("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "" }),
        });

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            }),
        );
        expect(createUser).not.toHaveBeenCalled();
    });

    // 更新処理
    test("PATCH /:userId (正常系)ユーザーを200で返す", async () => {
        findByUserId.mockClear();
        updateUser.mockClear();

        const response = await userRoutes.request(`/${defaultUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validUpdateUserInput),
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.user).toEqual(
            expect.objectContaining({
                name: validUpdateUserInput.name,
            }),
        );
        expect(updateUser).toHaveBeenCalledTimes(1);
    });

    // 存在しないIDの更新による失敗
    test("PATCH /:userId (異常系)存在しないIDなら404", async () => {
        updateUser.mockClear();

        const response = await userRoutes.request("/missing-user-id", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validUpdateUserInput),
        });

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ message: "user not found" });
        expect(updateUser).not.toHaveBeenCalled();
    });

    // 不正な入力による失敗
    test("PATCH /:userId (異常系)不正な入力なら400", async () => {
        updateUser.mockClear();

        const response = await userRoutes.request(`/${defaultUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            }),
        );
        expect(updateUser).not.toHaveBeenCalled();
    });

    // 削除処理
    test("DELETE /:userId (正常系)ユーザーを200で返す", async () => {
        deleteUser.mockClear();

        const response = await userRoutes.request(`/${defaultUser.id}`, {
            method: "DELETE",
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ user: jsonUser() });
        expect(deleteUser).toHaveBeenCalledWith(defaultUser.id);
    });

    // 存在しないIDの削除による失敗
    test("DELETE /:userId (異常系)存在しないIDなら404", async () => {
        const response = await userRoutes.request("/missing-user-id", {
            method: "DELETE",
        });

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ message: "user not found" });
    });
});

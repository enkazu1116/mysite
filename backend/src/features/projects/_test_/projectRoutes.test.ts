import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { defaultProject, defaultProjectId, validCreateProjectInput } from "./testHelpers";

function asJson<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

describe("projects router.ts HTTP エンドポイント", () => {
    const listProjects = mock(() => Promise.resolve([defaultProject]));
    const createProject = mock(() => Promise.resolve(defaultProject));
    const findProjectById = mock((projectId: string) =>
        Promise.resolve(projectId === defaultProjectId ? defaultProject : null),
    );
    const updateProject = mock(() => Promise.resolve(defaultProject));
    const deleteProject = mock(() => Promise.resolve(defaultProject));

    let projectsRouter: typeof import("../router/router").projectsRouter;

    beforeAll(async () => {
        mock.module(
            "../../../infrastructure/drizzle/repositories/projects/drizzleProjectRepository",
            () => ({
                DrizzleProjectRepository: class MockDrizzleProjectRepository {
                    listProjects = listProjects;
                    createProject = createProject;
                    findProjectById = findProjectById;
                    updateProject = updateProject;
                    deleteProject = deleteProject;
                },
            }),
        );

        ({ projectsRouter } = await import("../router/router"));
    });

    afterAll(() => {
        mock.restore();
    });

    test("GET / (正常系) projects 配列を 200 で返す", async () => {
        const response = await projectsRouter.request("/");

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            projects: [asJson(defaultProject)],
        });
        expect(listProjects).toHaveBeenCalled();
    });

    test("POST / (正常系) 作成結果を 201 で返す", async () => {
        const response = await projectsRouter.request("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validCreateProjectInput),
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toEqual({
            project: asJson(defaultProject),
        });
        expect(createProject).toHaveBeenCalled();
    });

    test("GET /:projectId (正常系) 詳細を 200 で返す", async () => {
        const response = await projectsRouter.request(`/${defaultProjectId}`);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            project: asJson(defaultProject),
        });
    });

    test("GET /:projectId (異常系) 存在しない ID は 404", async () => {
        const response = await projectsRouter.request(
            "/018f2f57-3f58-7c8f-9b7e-9b75b7298d99",
        );

        expect(response.status).toBe(404);
    });

    test("PATCH /:projectId (正常系) 更新結果を 200 で返す", async () => {
        const response = await projectsRouter.request(`/${defaultProjectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectName: "Updated" }),
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            project: asJson(defaultProject),
        });
        expect(updateProject).toHaveBeenCalled();
    });

    test("DELETE /:projectId (正常系) 削除結果を 200 で返す", async () => {
        const response = await projectsRouter.request(`/${defaultProjectId}`, {
            method: "DELETE",
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            project: asJson(defaultProject),
        });
        expect(deleteProject).toHaveBeenCalled();
    });
});

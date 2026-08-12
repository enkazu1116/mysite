import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { defaultSkill } from "./testHelpers";

describe("router.ts (正常系)HTTP エンドポイント", () => {
    const findAll = mock(() => Promise.resolve([defaultSkill]));

    let skillsRouter: typeof import("../router/router").skillsRouter;

    beforeAll(async () => {
        mock.module(
            "../../../infrastructure/drizzle/repositories/skills/drizzleSkillRepository",
            () => ({
                DrizzleSkillRepository: class MockDrizzleSkillRepository {
                    findAll = findAll;
                },
            }),
        );

        ({ skillsRouter } = await import("../router/router"));
    });

    afterAll(() => {
        mock.restore();
    });

    test("GET / (正常系)スキル配列を200で返す", async () => {
        const response = await skillsRouter.request("/");

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual([defaultSkill]);
        expect(findAll).toHaveBeenCalledTimes(1);
    });
});

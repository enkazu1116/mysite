import { describe, expect, mock, test } from "bun:test";
import { SkillUseCase } from "../usecase/skillUseCase";
import { skillValidationMessages } from "../validation/messages";
import {
    validCreateSkillsInput,
    validDeleteSkillsInput,
    validUpdateSkillsInput,
} from "./fixtures";
import { createMockSkillRepository, defaultSkill } from "./testHelpers";

describe("skillUseCase.ts / SkillUseCase", () => {
    describe("検索処理", () => {
        test("getAll (正常系)すべてのスキルを検索", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            const result = await useCase.getAll();

            expect(repository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([defaultSkill]);
        });

        test("getBySkillId (正常系)スキルIDを指定してスキルを検索", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            const result = await useCase.getBySkillId(defaultSkill.skillId);

            expect(repository.findBySkillId).toHaveBeenCalledWith(
                defaultSkill.skillId,
            );
            expect(result).toEqual(defaultSkill);
        });

        test("getBySkillId (異常系)存在しないIDを指定してスキルを検索", async () => {
            const repository = createMockSkillRepository({
                findBySkillId: mock(() => Promise.resolve(null)),
            });
            const useCase = new SkillUseCase(repository);

            const result = await useCase.getBySkillId("missing-skill-id");

            expect(result).toBeNull();
        });
    });

    describe("新規追加処理", () => {
        test("createSkills (正常系)新しいスキルを作成", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            const result = await useCase.createSkills(validCreateSkillsInput);

            expect(repository.createSkills).toHaveBeenCalledWith(
                validCreateSkillsInput,
            );
            expect(result).toEqual([defaultSkill]);
        });

        test("createSkills (異常系)不正な入力時のthrow処理", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await expect(
                useCase.createSkills({
                    userId: "not-uuid",
                    skills: [],
                }),
            ).rejects.toThrow();

            expect(repository.createSkills).not.toHaveBeenCalled();
        });

        test("createSkills (異常系)不正な入力時のthrow処理 エラーメッセージ改行確認", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await expect(
                useCase.createSkills({
                    userId: "not-uuid",
                    skills: [],
                }),
            ).rejects.toThrow(
                [
                    skillValidationMessages.userIdInvalid,
                    skillValidationMessages.skillsRequired,
                ].join("\n"),
            );
        });
    });

    describe("更新処理", () => {
        test("updateSkills (正常系)スキルを更新", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            const result = await useCase.updateSkills(validUpdateSkillsInput);

            expect(repository.updateSkills).toHaveBeenCalledWith(
                validUpdateSkillsInput,
            );
            expect(result).toEqual([defaultSkill]);
        });

        test("updateSkills (異常系)不正な入力時のthrow処理", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await expect(
                useCase.updateSkills({
                    userId: "not-uuid",
                    skills: [],
                }),
            ).rejects.toThrow();

            expect(repository.updateSkills).not.toHaveBeenCalled();
        });

        test("updateSkills (異常系)不正な入力時のthrow処理 スキルID不正時のエラーメッセージ確認", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await expect(
                useCase.updateSkills({
                    ...validUpdateSkillsInput,
                    skills: [
                        {
                            ...validUpdateSkillsInput.skills[0],
                            skillId: "not-uuid",
                        },
                    ],
                }),
            ).rejects.toThrow(skillValidationMessages.skillIdInvalid);

            expect(repository.updateSkills).not.toHaveBeenCalled();
        });
    });

    describe("削除処理", () => {
        test("deleteSkills (正常系)スキルを削除", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await useCase.deleteSkills(validDeleteSkillsInput);

            expect(repository.deleteSkills).toHaveBeenCalledWith(
                validDeleteSkillsInput,
            );
        });

        test("deleteSkills (異常系)不正な入力時のthrow処理", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await expect(
                useCase.deleteSkills({
                    userId: "not-uuid",
                    skillIds: [],
                }),
            ).rejects.toThrow();

            expect(repository.deleteSkills).not.toHaveBeenCalled();
        });

        test("deleteSkills (異常系)不正な入力時のthrow処理 スキルIDが空時のエラーメッセージ確認", async () => {
            const repository = createMockSkillRepository();
            const useCase = new SkillUseCase(repository);

            await expect(
                useCase.deleteSkills({
                    userId: validDeleteSkillsInput.userId,
                    skillIds: [],
                }),
            ).rejects.toThrow(skillValidationMessages.skillIdsRequired);

            expect(repository.deleteSkills).not.toHaveBeenCalled();
        });
    });
});

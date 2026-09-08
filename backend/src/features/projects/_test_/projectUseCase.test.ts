import { describe, expect, test } from "bun:test";
import { ProjectUseCase } from "../usecase/projectUseCase";
import { projectValidationMessages } from "../validation/messages/projectMessages";
import {
    createMockProjectRepository,
    defaultProject,
    defaultProjectId,
    validCreateProjectInput,
} from "./testHelpers";

describe("projectUseCase.ts / ProjectUseCase", () => {
    test("getProjects (正常系) 一覧を返す", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);

        const result = await useCase.getProjects({});

        expect(repository.listProjects).toHaveBeenCalledWith({});
        expect(result).toEqual([defaultProject]);
    });

    test("getProjectById (正常系) ID で取得する", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);

        const result = await useCase.getProjectById(defaultProjectId);

        expect(repository.findProjectById).toHaveBeenCalledWith(defaultProjectId);
        expect(result).toEqual(defaultProject);
    });

    test("createProject (正常系) 作成する", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);

        const result = await useCase.createProject(validCreateProjectInput);

        expect(repository.createProject).toHaveBeenCalledWith(
            validCreateProjectInput,
        );
        expect(result).toEqual(defaultProject);
    });

    test("createProject (異常系) 不正入力で throw", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);

        await expect(
            useCase.createProject({
                ...validCreateProjectInput,
                userId: "not-uuid",
                projectName: "",
            }),
        ).rejects.toThrow();

        expect(repository.createProject).not.toHaveBeenCalled();
    });

    test("updateProject (正常系) 部分更新する", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);
        const input = {
            projectId: defaultProjectId,
            projectName: "Updated Project",
            teamSize: 3,
        };

        const result = await useCase.updateProject(input);

        expect(repository.updateProject).toHaveBeenCalledWith(input);
        expect(result).toEqual(defaultProject);
    });

    test("updateProject (異常系) 不正な teamSize", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);

        await expect(
            useCase.updateProject({
                projectId: defaultProjectId,
                teamSize: 0,
            }),
        ).rejects.toThrow(projectValidationMessages.teamSizeInvalid);

        expect(repository.updateProject).not.toHaveBeenCalled();
    });

    test("deleteProject (正常系) 削除する", async () => {
        const repository = createMockProjectRepository();
        const useCase = new ProjectUseCase(repository);

        const result = await useCase.deleteProject(defaultProjectId);

        expect(repository.deleteProject).toHaveBeenCalledWith(defaultProjectId);
        expect(result).toEqual(defaultProject);
    });
});

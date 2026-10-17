import { mock } from "bun:test";
import type { ProjectRepository } from "../repositories/projectRepository";
import type { Project } from "../types/project";
import { instantFromDb } from "../../../util/temporal/instant";

const defaultInstant = instantFromDb("2026-08-10T00:00:00Z");
const defaultUserId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d2f";
const defaultProjectId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d40";

const defaultProject: Project = {
    projectId: defaultProjectId,
    userId: defaultUserId,
    projectName: "Portfolio Site",
    overview: "個人ポートフォリオサイトの構築",
    myRole: "フルスタック開発",
    teamSize: 1,
    technologies: "TypeScript / React / Hono",
    challenges: "ドメイン設計と実装の両立",
    decisions: "Books パターンに揃えた層構成",
    outcomes: "プロジェクト CRUD の公開",
    createdAt: defaultInstant,
    updatedAt: defaultInstant,
};

const validCreateProjectInput = {
    userId: defaultUserId,
    projectName: defaultProject.projectName,
    overview: defaultProject.overview,
    myRole: defaultProject.myRole,
    teamSize: defaultProject.teamSize,
    technologies: defaultProject.technologies,
    challenges: defaultProject.challenges,
    decisions: defaultProject.decisions,
    outcomes: defaultProject.outcomes,
};

function createMockProjectRepository(
    overrides: Partial<ProjectRepository> = {},
): ProjectRepository {
    return {
        createProject: mock(() => Promise.resolve(defaultProject)),
        listProjects: mock(() => Promise.resolve([defaultProject])),
        findProjectById: mock((projectId: string) =>
            Promise.resolve(
                projectId === defaultProjectId ? defaultProject : null,
            ),
        ),
        updateProject: mock(() => Promise.resolve(defaultProject)),
        deleteProject: mock(() => Promise.resolve(defaultProject)),
        ...overrides,
    };
}

export {
    createMockProjectRepository,
    defaultProject,
    defaultProjectId,
    defaultUserId,
    validCreateProjectInput,
};

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
    isHighlighted: true,
    startDate: "2026-01-01",
    endDate: null,
    description: "個人ポートフォリオサイトの構築",
    myRole: "フルスタック開発",
    teamSize: 1,
    technologies: "TypeScript / React / Hono",
    projectScale: "1名・小規模",
    challenges: "ドメイン設計と実装の両立",
    decisions: "Books パターンに揃えた層構成",
    outcomes: "プロジェクト CRUD の公開",
    reflection: "入力制約の整理が必要だった",
    createdAt: defaultInstant,
    updatedAt: defaultInstant,
};

const validCreateProjectInput = {
    userId: defaultUserId,
    projectName: defaultProject.projectName,
    isHighlighted: defaultProject.isHighlighted,
    startDate: defaultProject.startDate,
    endDate: defaultProject.endDate,
    description: defaultProject.description,
    myRole: defaultProject.myRole,
    teamSize: defaultProject.teamSize,
    technologies: defaultProject.technologies,
    projectScale: defaultProject.projectScale,
    challenges: defaultProject.challenges,
    decisions: defaultProject.decisions,
    outcomes: defaultProject.outcomes,
    reflection: defaultProject.reflection,
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

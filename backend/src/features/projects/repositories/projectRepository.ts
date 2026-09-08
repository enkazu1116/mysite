import type {
    CreateProjectInput,
    ListProjectsInput,
    UpdateProjectInput,
} from "../commands/projectCommands";
import type { Project } from "../types/project";

/**
 * プロジェクト永続化の境界
 */
interface ProjectRepository {
    createProject(input: CreateProjectInput): Promise<Project>;
    listProjects(input: ListProjectsInput): Promise<Project[]>;
    findProjectById(projectId: string): Promise<Project | null>;
    updateProject(input: UpdateProjectInput): Promise<Project>;
    deleteProject(projectId: string): Promise<Project>;
}

export type { ProjectRepository };

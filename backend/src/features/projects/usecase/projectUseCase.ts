import type {
    CreateProjectInput,
    ListProjectsInput,
    UpdateProjectInput,
} from "../commands/projectCommands";
import type { ProjectRepository } from "../repositories/projectRepository";
import type { Project } from "../types/project";
import {
    validateCreateProjectInput,
    validateListProjectsInput,
    validateUpdateProjectInput,
} from "../validation/validators/projectValidation";

class ProjectUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async createProject(input: CreateProjectInput): Promise<Project> {
        const { errors, data } = validateCreateProjectInput(input);
        if (errors.length > 0 || data === undefined) {
            throw new Error(errors.join("\n"));
        }

        return this.projectRepository.createProject(data);
    }

    async getProjects(input: ListProjectsInput = {}): Promise<Project[]> {
        const errors = validateListProjectsInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.projectRepository.listProjects(input);
    }

    async getProjectById(projectId: string): Promise<Project | null> {
        return this.projectRepository.findProjectById(projectId);
    }

    async updateProject(input: UpdateProjectInput): Promise<Project> {
        const errors = validateUpdateProjectInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.projectRepository.updateProject(input);
    }

    async deleteProject(projectId: string): Promise<Project> {
        return this.projectRepository.deleteProject(projectId);
    }
}

export { ProjectUseCase };

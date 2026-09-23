import { desc, eq } from "drizzle-orm";
import type {
    CreateProjectInput,
    ListProjectsInput,
    UpdateProjectInput,
} from "../../../../features/projects/commands/projectCommands";
import type { ProjectRepository } from "../../../../features/projects/repositories/projectRepository";
import type { Project } from "../../../../features/projects/types/project";
import { projectPersistenceMessages } from "../../../../util/messages/persistence/projects/project";
import { nowInstant } from "../../../../util/temporal/instant";
import { mapProjectRow } from "../../mappers/projects/projectMapper";
import db from "../../db";
import { projectsTable, usersTable } from "../../schema";

class DrizzleProjectRepository implements ProjectRepository {
    async createProject(input: CreateProjectInput): Promise<Project> {
        const [userRow] = await db
            .select({ userId: usersTable.user_id })
            .from(usersTable)
            .where(eq(usersTable.user_id, input.userId));

        if (!userRow) {
            throw new Error(projectPersistenceMessages.userNotFound);
        }

        const [created] = await db
            .insert(projectsTable)
            .values({
                user_id: input.userId,
                project_name: input.projectName,
                overview: input.overview,
                my_role: input.myRole,
                team_size: input.teamSize,
                technologies: input.technologies,
                challenges: input.challenges,
                decisions: input.decisions,
                outcomes: input.outcomes,
            })
            .returning();

        if (!created) {
            throw new Error(projectPersistenceMessages.createFailed);
        }

        return mapProjectRow(created);
    }

    async listProjects(input: ListProjectsInput): Promise<Project[]> {
        const rows = input.userId
            ? await db
                  .select()
                  .from(projectsTable)
                  .where(eq(projectsTable.user_id, input.userId))
                  .orderBy(desc(projectsTable.updated_at))
            : await db
                  .select()
                  .from(projectsTable)
                  .orderBy(desc(projectsTable.updated_at));

        return rows.map(mapProjectRow);
    }

    async findProjectById(projectId: string): Promise<Project | null> {
        const [row] = await db
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.project_id, projectId));

        return row ? mapProjectRow(row) : null;
    }

    async updateProject(input: UpdateProjectInput): Promise<Project> {
        const existing = await this.findProjectById(input.projectId);
        if (!existing) {
            throw new Error(projectPersistenceMessages.projectNotFound);
        }

        const [updated] = await db
            .update(projectsTable)
            .set({
                ...(input.projectName !== undefined
                    ? { project_name: input.projectName }
                    : {}),
                ...(input.overview !== undefined
                    ? { overview: input.overview }
                    : {}),
                ...(input.myRole !== undefined ? { my_role: input.myRole } : {}),
                ...(input.teamSize !== undefined
                    ? { team_size: input.teamSize }
                    : {}),
                ...(input.technologies !== undefined
                    ? { technologies: input.technologies }
                    : {}),
                ...(input.challenges !== undefined
                    ? { challenges: input.challenges }
                    : {}),
                ...(input.decisions !== undefined
                    ? { decisions: input.decisions }
                    : {}),
                ...(input.outcomes !== undefined
                    ? { outcomes: input.outcomes }
                    : {}),
                updated_at: nowInstant(),
            })
            .where(eq(projectsTable.project_id, input.projectId))
            .returning();

        if (!updated) {
            throw new Error(projectPersistenceMessages.updateFailed);
        }

        return mapProjectRow(updated);
    }

    async deleteProject(projectId: string): Promise<Project> {
        const existing = await this.findProjectById(projectId);
        if (!existing) {
            throw new Error(projectPersistenceMessages.projectNotFound);
        }

        const [deleted] = await db
            .delete(projectsTable)
            .where(eq(projectsTable.project_id, projectId))
            .returning();

        if (!deleted) {
            throw new Error(projectPersistenceMessages.deleteFailed);
        }

        return mapProjectRow(deleted);
    }
}

export { DrizzleProjectRepository };

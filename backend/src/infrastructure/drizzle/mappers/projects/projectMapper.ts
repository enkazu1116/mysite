import type { Project } from "../../../../features/projects/types/project";
import { projectsTable } from "../../schema";

export type ProjectTableRow = typeof projectsTable.$inferSelect;

function mapProjectRow(row: ProjectTableRow): Project {
    return {
        projectId: row.project_id,
        userId: row.user_id,
        projectName: row.project_name,
        overview: row.overview,
        myRole: row.my_role,
        teamSize: row.team_size,
        technologies: row.technologies,
        challenges: row.challenges,
        decisions: row.decisions,
        outcomes: row.outcomes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export { mapProjectRow };

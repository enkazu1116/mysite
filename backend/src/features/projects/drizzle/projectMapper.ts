import type { Project } from "../types/project";
import { projectsTable } from "./schema";

export type ProjectTableRow = typeof projectsTable.$inferSelect;

function mapProjectRow(row: ProjectTableRow): Project {
    return {
        projectId: row.project_id,
        userId: row.user_id,
        projectName: row.project_name,
        isHighlighted: row.is_highlighted,
        startDate: row.start_date,
        endDate: row.end_date,
        description: row.description,
        myRole: row.my_role,
        teamSize: row.team_size,
        technologies: row.technologies,
        projectScale: row.project_scale,
        challenges: row.challenges,
        decisions: row.decisions,
        outcomes: row.outcomes,
        reflection: row.reflection,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export { mapProjectRow };

import type { Temporal } from "../../../util/temporal/instant";

/**
 * ユーザーが参画したプロジェクトの記録
 */
type Project = {
    projectId: string;
    userId: string;
    projectName: string;
    isHighlighted: boolean;
    startDate: string | null;
    endDate: string | null;
    description: string;
    myRole: string;
    teamSize: number;
    technologies: string;
    projectScale: string;
    challenges: string;
    decisions: string;
    outcomes: string;
    reflection: string;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
};

export type { Project };

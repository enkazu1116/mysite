import type { Temporal } from "../../../util/temporal/instant";

/**
 * ユーザーが参画したプロジェクトの記録
 */
type Project = {
    projectId: string;
    userId: string;
    projectName: string;
    overview: string;
    myRole: string;
    teamSize: number;
    technologies: string;
    challenges: string;
    decisions: string;
    outcomes: string;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
};

export type { Project };

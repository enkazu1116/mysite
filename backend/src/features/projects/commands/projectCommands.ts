/**
 * プロジェクト作成入力
 */
type CreateProjectInput = {
    userId: string;
    projectName: string;
    overview: string;
    myRole: string;
    teamSize: number;
    technologies: string;
    challenges: string;
    decisions: string;
    outcomes: string;
};

/**
 * プロジェクト一覧取得入力（userId は任意フィルタ）
 */
type ListProjectsInput = {
    userId?: string;
};

/**
 * プロジェクト部分更新入力
 */
type UpdateProjectInput = {
    projectId: string;
    projectName?: string;
    overview?: string;
    myRole?: string;
    teamSize?: number;
    technologies?: string;
    challenges?: string;
    decisions?: string;
    outcomes?: string;
};

export type { CreateProjectInput, ListProjectsInput, UpdateProjectInput };

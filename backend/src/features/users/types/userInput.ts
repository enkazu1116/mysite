export interface CreateUserRequest {
    name: string;
    bio?: string | null;
    iconUrl?: string | null;
    githubUrl?: string | null;
    articleUrl?: string | null;
}

export interface UpdateUserRequest {
    name?: string;
    bio?: string | null;
    iconUrl?: string | null;
    githubUrl?: string | null;
    articleUrl?: string | null;
}

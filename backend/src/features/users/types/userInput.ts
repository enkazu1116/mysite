export interface CreateUserInput {
    name: string;
    bio?: string | null;
    iconUrl?: string | null;
}

export interface UpdateUserInput {
    name?: string;
    bio?: string | null;
    iconUrl?: string | null;
}

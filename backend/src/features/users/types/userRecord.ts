import type { ISO8601DateTime } from "../../../infrastructure/drizzle/types/iso8601DateTime";

type UserRecord = {
    userId: string;
    name: string;
    profile: string | null;
    createdAt: ISO8601DateTime;
    updatedAt: ISO8601DateTime;
};

export type { UserRecord };

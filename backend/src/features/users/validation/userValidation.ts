import { date, z } from "zod";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import type { UserRecord } from "../types/usersModel";

const userSchema = z.object({
    id: z.uuid().transform((id): UUID => id as UUID),
    name: z.string(),
    createdAt: z.date().transform((date): Date => date as ISO8601DateTime),
    updatedAt: z.date(),
}) satisfies z.ZodType<UserRecord>;


import { v7 as uuidv7 } from "uuid"
import type { UUID } from "./uuidBrandedType"

export function generateUuid(): UUID {
    return uuidv7() as UUID;
}
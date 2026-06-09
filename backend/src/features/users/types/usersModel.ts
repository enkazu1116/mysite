import type { AuditMetadata } from "../../../util/metadata/auditMetadata";
import type { UUID } from "../../../util/uuid/uuidBrandedType";

export interface UserCore {
    id: UUID;
    name: string;
}

export interface UserRecord extends UserCore, AuditMetadata {}

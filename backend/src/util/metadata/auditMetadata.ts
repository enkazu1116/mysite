import type { Temporal } from "../temporal/instant";

/** DB の created_at / updated_at に対応する監査メタデータ */
export interface AuditMetadata {
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
}

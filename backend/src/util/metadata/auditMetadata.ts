import { Temporal} from 'temporal-polyfill'

/** DB の created_at / updated_at に対応する監査メタデータ */
export interface AuditMetadata {
    createdAt: Temporal.PrainDateTime;
    updatedAt: Date;
}

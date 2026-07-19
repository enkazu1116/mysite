import { customType } from "drizzle-orm/sqlite-core";
import {
    instantFromDb,
    instantToIso,
    type Temporal,
} from "../../../util/temporal/instant";

const isoDateTime = customType<{
    data: Temporal.Instant;
    driverData: string;
}>({
    dataType: (): string => "text",
    toDriver: (value: Temporal.Instant): string => instantToIso(value),
    fromDriver: (value: string): Temporal.Instant => instantFromDb(value),
});

export default isoDateTime;

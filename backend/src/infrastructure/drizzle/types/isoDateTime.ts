import { customType } from "drizzle-orm/sqlite-core";

const isoDateTime = customType<{
    data: Date;
    driverData: string;
}>({
    dataType: (): string => "text",
    toDriver: (value: Date): string => value.toISOString(),
    fromDriver: (value: string): Date => new Date(value),
});

export default isoDateTime;
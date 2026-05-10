import { customType } from "drizzle-orm/sqlite-core";

const uuid = customType<{
    data: string;
    driverData: string;
}>({
    dataType: (): string => "text",
});

export default uuid;

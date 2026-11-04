import type { AdminAllowList } from "../../features/auth/domain/authIdentity";
import type { AppBindings } from "../../app";

function toIdentifiers(value: string | undefined): string[] {
    return (value ?? "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
}

export function getAdministratorAllowList(env: AppBindings): AdminAllowList {
    return {
        google: toIdentifiers(env.ADMIN_GOOGLE_SUBS),
        github: toIdentifiers(env.ADMIN_GITHUB_IDS),
    };
}

import { app } from "backend/app";
import { env } from "backend";

type WorkerEnv = Env & {
    BOOKS_API?: string;
};

export default {
    fetch(request: Request, bindings: WorkerEnv): Promise<Response> | Response {
        const runtimeEnv = env(bindings);
        const { pathname } = new URL(request.url);
        if (pathname.startsWith("/api") || pathname === "/health") {
            return app.fetch(request, runtimeEnv);
        }
        return runtimeEnv.ASSETS.fetch(request);
    },
} satisfies ExportedHandler<WorkerEnv>;

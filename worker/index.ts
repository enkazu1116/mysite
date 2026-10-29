import { app } from "../backend/src/app";

type WorkerEnv = Env & {
    BOOKS_API?: string;
};

export default {
    fetch(request: Request, env: WorkerEnv): Promise<Response> | Response {
        const { pathname } = new URL(request.url);
        if (pathname.startsWith("/api") || pathname === "/health") {
            return app.fetch(request, env);
        }
        return env.ASSETS.fetch(request);
    },
} satisfies ExportedHandler<WorkerEnv>;

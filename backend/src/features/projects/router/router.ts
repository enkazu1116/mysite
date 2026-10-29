import { Hono } from "hono";
import { validator } from "hono/validator";
import { createDbFromEnv, type AppBindings } from "../../../infrastructure/drizzle/db";
import { DrizzleProjectRepository } from "../drizzle/drizzleProjectRepository";
import { projectPersistenceMessages } from "../../../util/messages/persistence/projects/project";
import { ProjectUseCase } from "../usecase/projectUseCase";
import type { CreateProjectInput, UpdateProjectInput } from "../commands/projectCommands";

const projectsRouter = new Hono<{
    Bindings: AppBindings;
    Variables: { useCase: ProjectUseCase };
}>().use("*", async (c, next) => {
    c.set(
        "useCase",
        new ProjectUseCase(
            new DrizzleProjectRepository(createDbFromEnv(c.env)),
        ),
    );
    await next();
})
    .get("/", async (c) => {
        try {
            const userId = c.req.query("userId");
            const projects = await c.get("useCase").getProjects(
                userId ? { userId } : {},
            );
            return c.json({ projects });
        } catch (error) {
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "プロジェクトの一覧取得に失敗しました。",
                },
                400,
            );
        }
    })
    .post(
        "/",
        validator("json", (value) => value as CreateProjectInput),
        async (c) => {
        try {
            const body = c.req.valid("json");
            const project = await c.get("useCase").createProject(body);
            return c.json({ project }, 201);
        } catch (error) {
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "プロジェクトの登録に失敗しました。",
                },
                400,
            );
        }
        },
    )
    .get("/:projectId", async (c) => {
        try {
            const project = await c.get("useCase").getProjectById(c.req.param("projectId"));
            if (!project) {
                return c.json({ message: projectPersistenceMessages.projectNotFound }, 404);
            }
            return c.json({ project });
        } catch (error) {
            return c.json({ message: error instanceof Error ? error.message : "プロジェクトの取得に失敗しました。" }, 400);
        }
    })
    .patch(
        "/:projectId",
        validator(
            "json",
            (value) => value as Omit<UpdateProjectInput, "projectId">,
        ),
        async (c) => {
        try {
            const body = c.req.valid("json");
            const project = await c.get("useCase").updateProject({
                projectId: c.req.param("projectId"),
                ...body,
            });
            return c.json({ project });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "プロジェクトの更新に失敗しました。";
            const statusCode =
                message === projectPersistenceMessages.projectNotFound
                    ? 404
                    : 400;
            return c.json({ message }, statusCode);
        }
        },
    )
    .delete("/:projectId", async (c) => {
        try {
            const project = await c.get("useCase").deleteProject(
                c.req.param("projectId"),
            );
            return c.json({ project });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "プロジェクトの削除に失敗しました。";
            const statusCode =
                message === projectPersistenceMessages.projectNotFound
                    ? 404
                    : 400;
            return c.json({ message }, statusCode);
        }
    });

export { projectsRouter };

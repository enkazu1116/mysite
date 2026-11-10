import { Hono } from "hono";
import { validator } from "hono/validator";
import type { AppBindings } from "../../../app";
import { createDb } from "../../../infrastructure/drizzle/db";
import { DrizzleProjectRepository } from "../drizzle/drizzleProjectRepository";
import { projectPersistenceMessages } from "../../../util/messages/persistence/projects/project";
import { ProjectUseCase } from "../usecase/projectUseCase";
import type { CreateProjectInput, UpdateProjectInput } from "../commands/projectCommands";
import { HTTPException } from "hono/http-exception";
import { asHttpException } from "../../../middleware/httpError";

const projectsRouter = new Hono<{
    Bindings: AppBindings;
    Variables: { useCase: ProjectUseCase };
}>().use("*", async (c, next) => {
    c.set(
        "useCase",
        new ProjectUseCase(
            new DrizzleProjectRepository(createDb(c.env.DB)),
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
            throw asHttpException(error, 400, "プロジェクトの一覧取得に失敗しました。");
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
            throw asHttpException(error, 400, "プロジェクトの登録に失敗しました。");
        }
        },
    )
    .get("/:projectId", async (c) => {
        try {
            const project = await c.get("useCase").getProjectById(c.req.param("projectId"));
            if (!project) {
                throw new HTTPException(404, { message: projectPersistenceMessages.projectNotFound });
            }
            return c.json({ project });
        } catch (error) {
            throw asHttpException(error, 400, "プロジェクトの取得に失敗しました。");
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
            throw new HTTPException(statusCode, { message });
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
            throw new HTTPException(statusCode, { message });
        }
    });

export { projectsRouter };

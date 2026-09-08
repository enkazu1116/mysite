import { Hono } from "hono";
import { DrizzleProjectRepository } from "../../../infrastructure/drizzle/repositories/projects/drizzleProjectRepository";
import { projectPersistenceMessages } from "../../../util/messages/persistence/projects/project";
import { ProjectUseCase } from "../usecase/projectUseCase";

const projectUseCase = new ProjectUseCase(new DrizzleProjectRepository());

const projectsRouter = new Hono()
    .get("/", async (c) => {
        try {
            const userId = c.req.query("userId");
            const projects = await projectUseCase.getProjects(
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
    .post("/", async (c) => {
        try {
            const body = (await c.req.json()) as Parameters<
                typeof projectUseCase.createProject
            >[0];
            const project = await projectUseCase.createProject(body);
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
    })
    .get("/:projectId", async (c) => {
        const project = await projectUseCase.getProjectById(
            c.req.param("projectId"),
        );

        if (!project) {
            return c.json(
                { message: projectPersistenceMessages.projectNotFound },
                404,
            );
        }

        return c.json({ project });
    })
    .patch("/:projectId", async (c) => {
        try {
            const body = (await c.req.json()) as Omit<
                Parameters<typeof projectUseCase.updateProject>[0],
                "projectId"
            >;
            const project = await projectUseCase.updateProject({
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
    })
    .delete("/:projectId", async (c) => {
        try {
            const project = await projectUseCase.deleteProject(
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

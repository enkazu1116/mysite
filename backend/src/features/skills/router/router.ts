import { Hono } from "hono";
import { createDbFromEnv, type AppBindings } from "../../../infrastructure/drizzle/db";
import { DrizzleSkillRepository } from "../drizzle/drizzleSkillRepository";
import { SkillUseCase } from "../usecase/skillUseCase";

const skillsRouter = new Hono<{ Bindings: AppBindings }>().get("/", async (c) => {
    const skills = await new SkillUseCase(
        new DrizzleSkillRepository(createDbFromEnv(c.env)),
    ).getAll();
    return c.json(skills);
});

export { skillsRouter };

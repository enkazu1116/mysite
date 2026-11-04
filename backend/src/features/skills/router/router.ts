import { Hono } from "hono";
import type { AppBindings } from "../../../app";
import { createDb } from "../../../infrastructure/drizzle/db";
import { DrizzleSkillRepository } from "../drizzle/drizzleSkillRepository";
import { SkillUseCase } from "../usecase/skillUseCase";

const skillsRouter = new Hono<{ Bindings: AppBindings }>().get("/", async (c) => {
    const skills = await new SkillUseCase(
        new DrizzleSkillRepository(createDb(c.env.DB)),
    ).getAll();
    return c.json(skills);
});

export { skillsRouter };

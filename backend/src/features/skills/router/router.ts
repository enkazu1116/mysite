import { Hono } from "hono";
import { DrizzleSkillRepository } from "../../../infrastructure/drizzle/repositories/drizzleSkillRepository";
import { SkillUseCase } from "../usecase/skillUseCase";

const skillUseCase = new SkillUseCase(new DrizzleSkillRepository());

const skillsRouter = new Hono().get("/", async (c) => {
    const skills = await skillUseCase.getAll();
    return c.json(skills);
});

export { skillsRouter };

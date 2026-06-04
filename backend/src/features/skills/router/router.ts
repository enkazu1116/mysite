import { Hono } from "hono";
import { DrizzleSkillRepository } from "../../../infrastructure/drizzle/repositories/drizzleSkillRepository";
import { SkillUseCase } from "../usecase/skillUseCase";

const skillsRouter = new Hono();
const skillUseCase = new SkillUseCase(new DrizzleSkillRepository());

skillsRouter.get("/", async (c) => {
    const skills = await skillUseCase.getAll();
    return c.json(skills);
});

export { skillsRouter };

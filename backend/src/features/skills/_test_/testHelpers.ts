import { mock } from "bun:test";
import type { SkillRepository } from "../repositories/skillRepository";
import type { Skill } from "../types/skill";
import { samleSKill_javascript, toSkill } from "./fixtures";

const defaultSkill = toSkill(samleSKill_javascript);

/**
 * SkillRepository のモックを作る。 */
function createMockSkillRepository(
    overrides: Partial<SkillRepository> = {},
): SkillRepository {
    return {
        findAll: mock(() => Promise.resolve([defaultSkill])),
        findBySkillId: mock((skillId: string) =>
            Promise.resolve(
                skillId === defaultSkill.skillId ? defaultSkill : null,
            ),
        ),
        createSkills: mock(() => Promise.resolve([defaultSkill])),
        updateSkills: mock(() => Promise.resolve([defaultSkill])),
        deleteSkills: mock(() => Promise.resolve()),
        ...overrides,
    };
}

export { createMockSkillRepository, defaultSkill };

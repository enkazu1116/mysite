import type { Skill } from "../types/skill";
import type {
    CreateSkillInput,
    CreateSkillsInput,
    DeleteSkillsInput,
    UpdateSkillsInput,
} from "../types/skillInput";
import { SkillLevel } from "../types/skillLevel";
import { Tech } from "../types/tech";

/**
 * skill ドメインのテスト用フィクスチャ
 */
export type FixtureSkill = {
  user_id: string;
  skill_id: string;
  language: string;
  techs: Tech[];
  experienceMonths: number;
  level: SkillLevel;
  detail: string;
};

/** fixtureをドメイン型Skillに変換 */
export function toSkill(fixture: FixtureSkill): Skill {
  return {
    userId: fixture.user_id,
    skillId: fixture.skill_id,
    language: fixture.language,
    techs: fixture.techs,
    experienceMonths: fixture.experienceMonths,
    level: fixture.level,
    detail: fixture.detail,
  };
}

export const samleSKill_javascript: FixtureSkill = {
  user_id: "019ea605-0345-7282-a7e7-92a7787251c6",
  skill_id: "019ea605-9b19-75ac-b5c9-39566200e31a",
  language: "JavaScript",
  techs: [
    {
      techId: "019ea615-b8cc-7f2a-8b87-5a28ac4a735c",
      name: "React",
      category: "framework",
    },
    {
      techId: "019ea615-de31-7258-91e0-a50258e2a311",
      name: "Vue",
      category: "framework",
    },
  ],
  experienceMonths: 12,
  level: SkillLevel.CanLeadImplementation,
  detail: "フロントエンド開発の経験あり",
};

export const samleSkill_typescript: FixtureSkill = {
  user_id: "019ea615-1ff0-7a41-8ca8-3c065b5c2b1a",
  skill_id: "019ea615-5e84-7ca4-a789-6058621f3d8c",
  language: "TypeScript",
  techs: [
    {
      techId: "019ea616-147b-7af5-8ff6-21e2c334ecfc",
      name: "Next.js",
      category: "framework",
    },
    {
      techId: "019ea616-4029-755c-82bf-e372c231228d",
      name: "Nest.js",
      category: "framework",
    },
    {
      techId: "019ea616-4029-755c-82bf-e372c231228d",
      name: "Nuxt.js",
      category: "framework",
    },
  ],
  experienceMonths: 6,
  level: SkillLevel.WorksIndependently,
  detail: "経験多少あり",
};

export const samleSkill_go: FixtureSkill = {
  user_id: "019ea619-4dcb-759e-b4ac-2dead6fb14e0",
  skill_id: "019ea619-2efa-75e3-987b-bdd9e5dbb7f9",
  language: "Go",
  techs: [
    {
      techId: "019ea619-02ff-7f41-8072-7c09d545049b",
      name: "echo",
      category: "framework",
    },
  ],
  experienceMonths: 12,
  level: SkillLevel.CanGuideOrganization,
  detail: "一人ですべて実装可能",
};

/** 
 * バリデーション 正常系 
 * fixtureからInputを生成
 */
export function validCreateSkillInput(
  fixture: FixtureSkill = samleSKill_javascript,
): CreateSkillInput {
  return {
    language: fixture.language,
    techIds: fixture.techs.map((tech) => tech.techId),
    experienceMonths: fixture.experienceMonths,
    level: fixture.level,
    detail: fixture.detail,
  };
}

/** 
 * バリデーション 正常系 作成用バリデーション
 */
export const validCreateSkillsInput: CreateSkillsInput = {
  userId: samleSKill_javascript.user_id,
  skills: [validCreateSkillInput()],
};

/** 
 * バリデーション 正常系 更新用バリデーション
 */
export const validUpdateSkillsInput: UpdateSkillsInput = {
  userId: samleSKill_javascript.user_id,
  skills: [
    {
      skillId: samleSKill_javascript.skill_id,
      ...validCreateSkillInput(),
    },
  ],
};

/** 
 * バリデーション 正常系 削除用バリデーション
 */
export const validDeleteSkillsInput: DeleteSkillsInput = {
  userId: samleSKill_javascript.user_id,
  skillIds: [samleSKill_javascript.skill_id],
};

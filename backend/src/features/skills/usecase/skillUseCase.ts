import type { SkillRepository } from "../repositories/skillRepository";
import type { Skill } from "../types/skill";
import type {
    CreateSkillsInput,
    DeleteSkillsInput,
    UpdateSkillsInput,
} from "../types/skillInput";
import {
    validateCreateSkillsInput,
    validateDeleteSkillsInput,
    validateUpdateSkillsInput,
} from "../validation/skillValidation";

/**
 * スキル機能のビジネスロジックを扱う UseCase。
 */
class SkillUseCase {
    constructor(private readonly skillRepository: SkillRepository) {}

    /**
     * 全スキル情報を取得する。
     *
     * @returns スキル一覧
     */
    async getAll(): Promise<Skill[]> {
        return this.skillRepository.findAll();
    }

    /**
     * 指定したスキル ID に紐づくスキル情報を取得する。
     *
     * @param skillId 検索対象のスキル ID
     * @returns 指定スキルの情報。存在しない場合は null
     */
    async getBySkillId(skillId: string): Promise<Skill | null> {
        return this.skillRepository.findBySkillId(skillId);
    }

    /**
     * スキル情報を一括登録する。
     *
     * @param input 登録対象のスキル情報
     * @returns 登録後のスキル情報一覧
     */
    async createSkills(input: CreateSkillsInput): Promise<Skill[]> {
        const errors = validateCreateSkillsInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.skillRepository.createSkills(input);
    }

    /**
     * スキル情報を一括更新する。
     *
     * @param input 更新対象のスキル情報
     * @returns 更新後のスキル情報一覧
     */
    async updateSkills(input: UpdateSkillsInput): Promise<Skill[]> {
        const errors = validateUpdateSkillsInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.skillRepository.updateSkills(input);
    }

    /**
     * スキル情報を一括削除する。
     *
     * @param input 削除対象の識別情報
     */
    async deleteSkills(input: DeleteSkillsInput): Promise<void> {
        const errors = validateDeleteSkillsInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        await this.skillRepository.deleteSkills(input);
    }
}

export { SkillUseCase };

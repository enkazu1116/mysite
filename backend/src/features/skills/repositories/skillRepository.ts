import type {
    CreateSkillsInput,
    DeleteSkillsInput,
    UpdateSkillsInput,
} from "../types/skillInput";
import type { Skill } from "../types/skill";

/**
 * スキル情報の永続化層に対する契約を表す Repository。
 */
interface SkillRepository {
    /**
     * 登録されているすべてのスキル情報を取得する。
     *
     * @returns スキル一覧
     */
    findAll(): Promise<Skill[]>;

    /**
     * 指定したスキル ID に紐づくスキル情報を取得する。
     *
     * @param skillId 検索対象のスキル ID
     * @returns 指定スキルの情報。存在しない場合は null
     */
    findBySkillId(skillId: string): Promise<Skill | null>;

    /**
     * 複数のスキル情報を一括登録する。
     *
     * @param input 登録対象のスキル情報
     * @returns 登録後のスキル情報一覧
     */
    createSkills(input: CreateSkillsInput): Promise<Skill[]>;

    /**
     * 複数のスキル情報を一括更新する。
     *
     * @param input 更新対象のスキル情報
     * @returns 更新後のスキル情報一覧
     */
    updateSkills(input: UpdateSkillsInput): Promise<Skill[]>;

    /**
     * 複数のスキル情報を一括削除する。
     *
     * @param input 削除対象の識別情報
     */
    deleteSkills(input: DeleteSkillsInput): Promise<void>;
}

export type { SkillRepository };

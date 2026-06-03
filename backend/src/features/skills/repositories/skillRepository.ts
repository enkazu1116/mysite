import type {
    CreateSkillInput,
    DeleteSkillInput,
    UpdateSkillInput,
} from "../types/skillInput";
import type { Skill } from "../types/skill";

/**
 * スキル情報の永続化層に対する取得契約を表す Repository。
 * アプリケーション層はこの契約に依存し、具体的な DB 実装には依存しない。
 */
interface SkillRepository {
    /**
     * 登録されているすべてのスキル情報を取得する。
     *
     * @returns スキル一覧
     */
    findAll(): Promise<Skill[]>;

    /**
     * 指定したユーザーに紐づくスキル情報を取得する。
     *
     * @param userId 検索対象のユーザー ID
     * @returns 指定ユーザーのスキル一覧
     */
    findByUserId(userId: string): Promise<Skill[]>;

    /**
     * 1 件分のスキル情報を新規登録する。
     * フロントエンドで複数言語が選択されていても、このメソッドは 1 言語ずつ登録する想定。
     *
     * @param input 登録対象のスキル情報
     * @returns 登録後のスキル情報
     */
    create(input: CreateSkillInput): Promise<Skill>;

    /**
     * 既存のスキル情報を 1 件更新する。
     * 更新対象は skillId と userId の組み合わせで特定する。
     *
     * @param input 更新対象のスキル情報
     * @returns 更新後のスキル情報
     */
    update(input: UpdateSkillInput): Promise<Skill>;

    /**
     * 既存のスキル情報を 1 件物理削除する。
     * 削除対象は skillId と userId の組み合わせで特定する。
     *
     * @param input 削除対象の識別情報
     */
    delete(input: DeleteSkillInput): Promise<void>;
}

export type { SkillRepository };

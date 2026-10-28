/**
 * プロジェクトの登録・更新・一覧用バリデーションメッセージ
 */
const projectValidationMessages = {
    userIdInvalid: "ユーザーIDが不正です。",
    projectIdInvalid: "プロジェクトIDが不正です。",
    projectNameRequired: "プロジェクト名は必須です。",
    highlightInvalid: "ハイライト設定が不正です。",
    dateInvalid: "日付は YYYY-MM-DD 形式で指定してください。",
    dateRangeInvalid: "終了日は開始日以降に指定してください。",
    descriptionRequired: "説明は必須です。",
    myRoleRequired: "役割は必須です。",
    teamSizeInvalid: "チーム規模は1以上の整数で指定してください。",
    technologiesRequired: "使用技術は必須です。",
    projectScaleRequired: "プロジェクト規模は必須です。",
    challengesRequired: "課題は必須です。",
    decisionsRequired: "工夫 / 意思決定は必須です。",
    outcomesRequired: "成果は必須です。",
    reflectionRequired: "反省点は必須です。",
} as const;

export { projectValidationMessages };

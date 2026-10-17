/**
 * プロジェクト永続化層のエラーメッセージ
 */
const projectPersistenceMessages = {
    userNotFound: "ユーザーが見つかりませんでした。",
    createFailed: "プロジェクトの登録に失敗しました。",
    updateFailed: "プロジェクトの更新に失敗しました。",
    projectNotFound: "プロジェクトが見つかりませんでした。",
    deleteFailed: "プロジェクトの削除に失敗しました。",
} as const;

export { projectPersistenceMessages };

/**
 * Users 永続化層のエラーメッセージ
 */
const userPersistenceMessages = {
    createFailed: "ユーザーの作成に失敗しました。",
    notFound: "ユーザーが見つかりませんでした。",
} as const;

export { userPersistenceMessages };

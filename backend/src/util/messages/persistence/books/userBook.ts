/**
 * UserBook / Book カタログ永続化層のエラーメッセージ
 */
const userBookPersistenceMessages = {
    userNotFound: "ユーザーが見つかりませんでした。",
    createFailed: "ユーザー本の登録に失敗しました。",
    updateFailed: "ユーザー本の更新に失敗しました。",
    userBookNotFound: "ユーザー本が見つかりませんでした。",
    deleteFailed: "ユーザー本の削除に失敗しました。",
    bookNotFound: "本が見つかりません。",
    bookCreateFailed: "書籍の登録に失敗しました。",
} as const;

export { userBookPersistenceMessages };

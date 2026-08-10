/**
 * ユーザー本の登録・更新・一覧、および本検索クエリ用のバリデーションメッセージ
 */
const userBookValidationMessages = {
    queryRequired: "検索条件を入力してください",
    userIdInvalid: "ユーザーIDが不正です。",
    userBookIdInvalid: "本のIDが不正です。",

    // 登録時に必須（失敗すると処理全体が失敗する）
    sourceUnsupported: "サポートされていない検索サービスです",
    sourceBookIdRequired: "検索結果が存在しません。",
    titleRequired: "タイトルは必須です",

    // 書誌の任意項目は不正時に null/[] へフォールバックするため、通常は使わない
    authorsInvalid: "著者を取得できません",
    publisherInvalid: "出版社を取得できません",
    publishedDateInvalid: "出版日を取得できません",
    descriptionInvalid: "説明を取得できません",
    pageCountInvalid: "ページ数を取得できません",
    thumbnailUrlInvalid: "サムネイル画像のURLを取得できません",
    infoLinkInvalid: "詳細ページのURLを取得できません",

    // 更新時にユーザーが明示送信する項目（不正なら専用メッセージで失敗）
    statusInvalid: "読書ステータスが不正です。",
    currentPageInvalid: "現在のページ数が不正です。",
    noteInvalid: "メモが不正です。",
    startedAtInvalid: "読み始めた日時が不正です。",
    finishedAtInvalid: "読み終わった日時が不正です。",
};

export { userBookValidationMessages };

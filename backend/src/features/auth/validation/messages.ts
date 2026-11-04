/**
 * 認証ドメインのバリデーション / エラーメッセージ
 */
const authValidationMessages = {
    providerUnsupported: "サポートされていない認証プロバイダーです。",
    setupIncomplete: "認証設定が不足しています。",
    oauthVerificationFailed: "OAuth の検証に失敗しました。",
    identityFetchFailed: "OAuth ユーザー情報を取得できません。",
    administratorNotAllowed: "管理者として許可されていません。",
    jwtSecretInvalid: "JWT_SECRET が未設定または短すぎます。",
    originUnverified: "リクエスト元を確認できません。",
    administratorLoginRequired: "管理者ログインが必要です。",
    authenticationFailed: "認証処理に失敗しました。",
} as const;

export { authValidationMessages };

/**
 * OAuth認証のコールバックURLを作成
 * 認可後にリダイレクトされるURLを作成する必要があるため、
 * URLを用いて、Originを取得し、APIのエンドポイントを作成する
 * 
 * @param requestUrl 
 * @param provider 
 * @returns 
 */
export function oauthCallbackUrl(requestUrl: string, provider: string): string {
    return `${new URL(requestUrl).origin}/api/auth/${provider}/callback`;
}

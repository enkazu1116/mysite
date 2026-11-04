import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { ErrorState, LoadingState } from "../../components/status";

type Session = { authenticated: boolean; subject: string | null };

export function AdminGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("session check failed");
        return response.json() as Promise<Session>;
      })
      .then((value) => { if (active) setSession(value); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [location.pathname]);

  if (error) return <ErrorState message="認証状態を確認できません。" />;
  if (!session) return <LoadingState />;
  if (!session.authenticated) {
    return (
      <main className="mx-auto max-w-xl flex-1 px-6 py-12">
        <h1 className="font-display text-3xl">管理者ログイン</h1>
        <p>管理者に登録されたアカウントでログインしてください。</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="obsidian-nav-link" href="/api/auth/google">Google でログイン</a>
          <a className="obsidian-nav-link" href="/api/auth/github">GitHub でログイン</a>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}

export default function AdminPage() {
  const [users, setUsers] = useState<Array<{ userId?: string; id?: string; name?: string }>>([]);
  useEffect(() => {
    fetch("/api/users").then((response) => response.json())
      .then((body: { users?: typeof users }) => { setUsers(body.users ?? []); })
      .catch(() => { setUsers([]); });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.location.assign("/admin");
  }

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl">管理者ページ</h1>
        <button className="obsidian-nav-link" type="button" onClick={() => void logout()}>ログアウト</button>
      </div>
      <p>ユーザーごとのプロジェクトと本を管理できます。</p>
      <ul className="mt-6 space-y-4">
        {users.map((user) => {
          const id = user.userId ?? user.id;
          return id ? (
            <li key={id}>
              <span className="mr-4">{user.name ?? id}</span>
              <Link className="obsidian-nav-link" to={`/users/${id}/projects`}>Projects 管理</Link>
              <Link className="obsidian-nav-link" to={`/users/${id}/books`}>Books 管理</Link>
            </li>
          ) : null;
        })}
      </ul>
    </main>
  );
}

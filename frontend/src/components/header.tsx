import { Link } from "@heroui/react/link";
import { NavLink } from "react-router";
import { profile } from "../features/Home/data/profileData";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/users", label: "Users" },
  { to: "/books", label: "Books" },
] as const;

export default function Header() {
  return (
    <header
      data-app-header
      className="h-16 shrink-0 border-b border-[var(--lib-line)] bg-[var(--lib-paper)] px-4"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3">
        <p className="font-display m-0 truncate text-base font-semibold text-[var(--lib-ink)]">
          {profile.name}
        </p>

        <nav aria-label="メインナビゲーション" className="min-w-0">
          <ul className="m-0 flex list-none flex-nowrap items-center justify-end gap-x-3 overflow-x-auto p-0 text-sm">
            {navItems.map(({ to, label }) => (
              <li key={to} className="shrink-0">
                <NavLink to={to}>
                  {({ isActive }) => (
                    <Link
                      href={to}
                      className={
                        isActive
                          ? "font-semibold text-[var(--lib-accent)] underline decoration-2 underline-offset-4"
                          : "text-[var(--lib-ink-muted)] no-underline"
                      }
                    >
                      {label}
                    </Link>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

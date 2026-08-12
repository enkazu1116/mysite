import { Link, Typography } from "@heroui/react";
import { NavLink } from "react-router";

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
      className="border-b border-gray-200 bg-white px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Typography.Heading
          level={1}
          className="m-0 truncate text-sm font-semibold sm:text-base"
        >
          Profile Dashboard
        </Typography.Heading>

        <nav aria-label="メインナビゲーション" className="min-w-0">
          <ul className="m-0 flex list-none flex-nowrap items-center justify-end gap-x-2.5 overflow-x-auto p-0 text-xs sm:text-sm">
            {navItems.map(({ to, label }) => (
              <li key={to} className="shrink-0">
                <NavLink to={to}>
                  {({ isActive }) => (
                    <Link
                      href={to}
                      className={isActive ? "font-semibold underline" : undefined}
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

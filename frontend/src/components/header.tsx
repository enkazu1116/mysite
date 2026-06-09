import { Link, Typography } from "@heroui/react";
import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/books", label: "Books" },
] as const;

export default function Header() {
  return (
    <header className="border-b border-gray-200 px-4 py-6 dark:border-gray-700">
      <Typography.Heading level={1} className="m-0 mb-4 text-2xl sm:text-3xl">
        Welcome to my profile website page
      </Typography.Heading>

      <nav aria-label="メインナビゲーション">
        <ul className="flex list-none flex-wrap justify-center gap-2 p-0">
          {navItems.map(({ to, label }) => (
            <li key={to}>
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
    </header>
  );
}

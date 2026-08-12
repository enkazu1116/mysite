import type { Users } from "../types/users";

export const users: Users[] = [
  {
    id: "user-1",
    name: "John",
    role: "Web Developer",
    email: "john@example.com",
    status: "active",
    userType: "developer",
    booksCount: 18,
    skillsCount: 12,
    lastActiveAt: "2026-08-10",
  },
  {
    id: "user-2",
    name: "Guest Reader",
    role: "Reader",
    email: "reader@example.com",
    status: "invited",
    userType: "guest",
    booksCount: 4,
    skillsCount: 3,
    lastActiveAt: "2026-08-04",
  },
  {
    id: "user-3",
    name: "Archive User",
    role: "Maintainer",
    email: "archive@example.com",
    status: "inactive",
    userType: "guest",
    booksCount: 31,
    skillsCount: 8,
    lastActiveAt: "2026-07-22",
  },
];

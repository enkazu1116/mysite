export type Users = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: UserStatus;
  userType?: UserType;
  booksCount: number;
  skillsCount: number;
  lastActiveAt: string;
};

export type UserStatus = "active" | "invited" | "inactive";
export type UserType = "developer" | "guest";

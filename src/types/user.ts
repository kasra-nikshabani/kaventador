import type { ID, ISODateString } from "./common";

export type UserRole = "admin" | "instructor" | "student";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "مدیر",
  instructor: "مدرس",
  student: "دانشجو",
};

export type UserStatus = "active" | "inactive" | "banned";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "فعال",
  inactive: "غیرفعال",
  banned: "مسدود",
};

/** کاربر پلتفرم — در پنل ادمین مدیریت می‌شود. */
export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: ISODateString;
  lastActiveAt?: ISODateString;
  enrolledCourseIds: ID[];
}

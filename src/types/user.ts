import type { ID, ISODateString } from "./common";
import type { Enrollment } from "./enrollment";

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
  /** نام کاربری یکتا — ورود با همین انجام می‌شود، نه با ایمیل. */
  username: string;
  email: string;
  /**
   * رمز عبور هش‌شده با scrypt.
   * هرگز به کلاینت فرستاده نمی‌شود؛ لایه سرویس آن را حذف می‌کند.
   */
  passwordHash: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: ISODateString;
  lastActiveAt?: ISODateString;
  /**
   * پروفایل عمومی مدرس/نویسنده.
   * فقط حساب‌های `instructor` و `admin` دارند؛ دانشجو ندارد.
   * دوره‌ها به `Person` وصل‌اند نه `User`، و این پل بین آن دوست.
   */
  personId?: ID;
  enrollments: Enrollment[];
}

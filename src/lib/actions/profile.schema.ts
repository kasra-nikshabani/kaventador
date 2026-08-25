import { z } from "zod";
import { toPersianDigits } from "@/lib/utils/format";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, `نام باید دست‌کم ${toPersianDigits(3)} نویسه باشد.`)
    .max(80, `نام نباید بیش از ${toPersianDigits(80)} نویسه باشد.`),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "ایمیل را وارد کنید.")
    .email("فرمت ایمیل معتبر نیست."),
});

export type ProfileState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export const PROFILE_INITIAL_STATE: ProfileState = { status: "idle" };

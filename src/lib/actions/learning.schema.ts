/**
 * ثابت و تایپ اکشن‌های یادگیری.
 *
 * ⚠️ عمداً از `learning.ts` جداست: فایل `"use server"` فقط اجازه دارد
 * تابع async صادر کند. اگر این ثابت آنجا بماند، `tsc` و `build` هر دو
 * پاس می‌شوند ولی صفحه در زمان اجرا ۵۰۰ می‌دهد.
 */

export type LearningState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const LEARNING_INITIAL_STATE: LearningState = { status: "idle" };

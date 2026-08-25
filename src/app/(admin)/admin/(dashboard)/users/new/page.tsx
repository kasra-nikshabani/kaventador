import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NewUserForm } from "@/components/admin/new-user-form";

export const metadata: Metadata = { title: "کاربر جدید" };

export default function NewUserPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="کاربر جدید"
        description="ساخت حساب مدرس فقط از همین‌جا ممکن است؛ ثبت‌نام عمومی سایت همیشه حساب دانشجو می‌سازد."
      />
      <NewUserForm />
    </div>
  );
}

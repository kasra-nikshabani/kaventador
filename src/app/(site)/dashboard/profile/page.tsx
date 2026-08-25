import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { ProfileForm } from "@/components/account/profile-form";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { USER_ROLE_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "پروفایل",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Fdashboard%2Fprofile");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">پروفایل</h2>
        <p className="text-muted mt-1.5 text-sm">
          {USER_ROLE_LABELS[user.role]} · عضو از {formatDate(user.joinedAt)}
        </p>
      </div>

      <Card className="p-6">
        <h3 className="mb-5 font-bold">تصویر پروفایل</h3>
        <AvatarUpload name={user.name} currentUrl={user.avatar} />
      </Card>

      <Card className="p-6">
        <h3 className="mb-5 font-bold">اطلاعات حساب</h3>
        <ProfileForm
          name={user.name}
          email={user.email}
          username={user.username}
        />
      </Card>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  articleFormSchema,
  categoryFormSchema,
  collectErrors,
  createUserFormSchema,
  userFormSchema,
  type DeleteState,
  type FormState,
} from "@/lib/actions/content.schema";
import { persistCourse } from "@/lib/actions/course-write";
import { getAdminSession } from "@/lib/auth/session";
import {
  countCategoryUsage,
  findArticleById,
  insertArticle,
  insertCategory,
  nextId,
  patchArticle,
  patchCategory,
  patchUser,
  removeArticle,
  removeCategory,
  removeCourse,
  removeUser,
} from "@/lib/repositories";
import { formatNumber } from "@/lib/utils/format";
import { hashPassword } from "@/lib/auth/password";
import {
  findUserByEmail,
  findUserByUsername,
  insertPerson,
  insertUser,
} from "@/lib/repositories";

/**
 * اکشن‌های نوشتن پنل مدیریت.
 *
 * هر اکشن قبل از هر کاری نشست را بررسی می‌کند: میان‌افزار فقط ناوبری را
 * می‌بندد و اکشن‌ها را نمی‌بیند، پس بدون این بررسی هر کسی می‌توانست
 * مستقیم به اکشن درخواست بفرستد.
 */
async function requireSession(): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/login?next=%2Fadmin");
}

/** همه مسیرهایی که با تغییر محتوا کهنه می‌شوند. */
function revalidateContent() {
  revalidatePath("/", "layout");
}

function readForm(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

const nowIso = () => new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------
   دسته‌بندی
--------------------------------------------------------------- */

export async function saveCategoryAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = categoryFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values,
    };
  }

  if (id) {
    await patchCategory(id, parsed.data);
  } else {
    await insertCategory({ id: nextId("cat"), ...parsed.data });
  }

  revalidateContent();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const usage = await countCategoryUsage(id);

  /* حذف دسته‌بندی پرکاربرد، دوره و مقاله را بی‌سرپرست می‌کند. */
  if (usage > 0) {
    return {
      status: "error",
      message: `این دسته‌بندی به ${formatNumber(usage)} دوره یا مقاله وصل است. اول آن‌ها را جابه‌جا کنید.`,
    };
  }

  const removed = await removeCategory(id);
  if (!removed) return { status: "error", message: "دسته‌بندی پیدا نشد." };

  revalidateContent();
  return { status: "success" };
}

/* ---------------------------------------------------------------
   مقاله
--------------------------------------------------------------- */

export async function saveArticleAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = articleFormSchema.safeParse({
    ...values,
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values,
    };
  }

  const data = parsed.data;

  if (id) {
    const existing = await findArticleById(id);
    if (!existing) return { status: "error", message: "مقاله پیدا نشد." };

    await patchArticle(id, {
      ...data,
      isFeatured: Boolean(data.isFeatured),
      updatedAt: nowIso(),
    });
  } else {
    await insertArticle({
      id: nextId("article"),
      ...data,
      isFeatured: Boolean(data.isFeatured),
      cover: "",
      authorId: "person-kasra",
      viewCount: 0,
      publishedAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  revalidateContent();
  redirect("/admin/articles?saved=1");
}

export async function deleteArticleAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const removed = await removeArticle(String(formData.get("id") ?? ""));
  if (!removed) return { status: "error", message: "مقاله پیدا نشد." };

  revalidateContent();
  return { status: "success" };
}

/* ---------------------------------------------------------------
   دوره
--------------------------------------------------------------- */

export async function saveCourseAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  /* مدیر مدرس را از فهرست انتخاب می‌کند، پس مقدار فرم محترم است. */
  return persistCourse(formData, { redirectTo: "/admin/courses?saved=1" });
}

export async function deleteCourseAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const removed = await removeCourse(String(formData.get("id") ?? ""));
  if (!removed) return { status: "error", message: "دوره پیدا نشد." };

  revalidateContent();
  return { status: "success" };
}

/* ---------------------------------------------------------------
   کاربر
--------------------------------------------------------------- */

export async function saveUserAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = userFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values,
    };
  }

  const updated = await patchUser(id, parsed.data);
  if (!updated) return { status: "error", message: "کاربر پیدا نشد." };

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function deleteUserAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const removed = await removeUser(String(formData.get("id") ?? ""));
  if (!removed) return { status: "error", message: "کاربر پیدا نشد." };

  revalidatePath("/admin/users");
  return { status: "success" };
}

/**
 * ساخت کاربر از پنل مدیریت.
 *
 * برای نقش `instructor` یک پروفایل `Person` هم ساخته می‌شود و به حساب
 * وصل می‌گردد — چون دوره‌ها به `Person` ارجاع می‌دهند نه به `User`، و
 * بدون این پل، پنل مدرس نمی‌داند کدام دوره‌ها مال اوست.
 */
export async function createUserAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const values = readForm(formData);
  const parsed = createUserFormSchema.safeParse(values);

  /* رمز عبور هرگز به فرم برنمی‌گردد. */
  const echo = {
    name: values.name ?? "",
    username: values.username ?? "",
    email: values.email ?? "",
    role: values.role ?? "student",
    personRole: values.personRole ?? "",
    personBio: values.personBio ?? "",
  };

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values: echo,
    };
  }

  const { name, username, email, password, role, personRole, personBio } =
    parsed.data;

  if (await findUserByUsername(username)) {
    return {
      status: "error",
      message: "این نام کاربری قبلاً گرفته شده است.",
      errors: { username: "در دسترس نیست." },
      values: echo,
    };
  }

  if (await findUserByEmail(email)) {
    return {
      status: "error",
      message: "این ایمیل قبلاً ثبت شده است.",
      errors: { email: "در دسترس نیست." },
      values: echo,
    };
  }

  let personId: string | undefined;

  if (role === "instructor" || role === "admin") {
    const person = await insertPerson({
      id: nextId("person"),
      slug: username,
      name,
      role: personRole || "مدرس کاوِنتادور",
      bio: personBio || "",
      avatar: "",
      socials: {},
    });
    personId = person.id;
  }

  await insertUser({
    id: nextId("user"),
    name,
    username,
    email,
    passwordHash: await hashPassword(password),
    personId,
    role,
    status: "active",
    joinedAt: nowIso(),
    enrollments: [],
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

import type { ID, Slug, SocialProfile } from "./common";

/**
 * مدرس دوره یا نویسنده مقاله.
 * عمداً یک موجودیت مشترک است چون در کاوِنتادور معمولاً یک نفر هر دو نقش را دارد.
 */
export interface Person {
  id: ID;
  slug: Slug;
  name: string;
  /** سمت یا تخصص، مثلاً «مهندس ارشد بک‌اند». */
  role: string;
  bio: string;
  avatar: string;
  socials: SocialProfile;
}

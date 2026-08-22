import type { Category } from "./category";
import type { ContentStatus, ID, ISODateString, Slug } from "./common";
import type { Person } from "./person";

/** مقاله وبلاگ. */
export interface Article {
  id: ID;
  slug: Slug;
  title: string;
  excerpt: string;
  /**
   * بدنه مقاله. فعلاً متن ساده/HTML سبک است؛
   * در مرحله اتصال داده به MDX ارتقا پیدا می‌کند.
   */
  content: string;
  cover: string;
  categoryId: ID;
  authorId: ID;
  tags: string[];
  status: ContentStatus;

  /** زمان تقریبی مطالعه به دقیقه. */
  readingMinutes: number;
  viewCount: number;
  isFeatured: boolean;

  publishedAt: ISODateString;
  updatedAt: ISODateString;
}

/** مقاله به همراه روابطش. */
export interface ArticleWithRelations extends Article {
  category: Category;
  author: Person;
}

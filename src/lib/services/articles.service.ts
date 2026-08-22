import {
  findAllArticles,
  findAllCategories,
  findAllPeople,
  findArticleBySlug,
} from "@/lib/repositories";
import { byNewest, matchesSearch, paginate } from "@/lib/services/shared";
import type {
  Article,
  ArticleWithRelations,
  Paginated,
  QueryOptions,
} from "@/types";

async function attachRelations(
  articles: Article[],
): Promise<ArticleWithRelations[]> {
  const [categories, people] = await Promise.all([
    findAllCategories(),
    findAllPeople(),
  ]);

  return articles.flatMap((article) => {
    const category = categories.find((item) => item.id === article.categoryId);
    const author = people.find((item) => item.id === article.authorId);

    if (!category || !author) return [];

    return [{ ...article, category, author }];
  });
}

function sortArticles(
  articles: ArticleWithRelations[],
  sort: QueryOptions["sort"],
) {
  const sorted = [...articles];

  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => byNewest(b, a));
    case "popular":
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    default:
      return sorted.sort(byNewest);
  }
}

/** فهرست مقالات منتشرشده با فیلتر، جستجو و صفحه‌بندی. */
export async function getArticles(
  options: QueryOptions = {},
): Promise<Paginated<ArticleWithRelations>> {
  const all = await attachRelations(await findAllArticles());

  const filtered = all.filter((article) => {
    if (article.status !== "published") return false;
    if (options.categorySlug && article.category.slug !== options.categorySlug)
      return false;
    if (options.tag && !article.tags.includes(options.tag)) return false;
    if (options.featuredOnly && !article.isFeatured) return false;

    return matchesSearch(
      options.search,
      article.title,
      article.excerpt,
      ...article.tags,
    );
  });

  return paginate(
    sortArticles(filtered, options.sort),
    options.page,
    options.pageSize,
  );
}

/** تازه‌ترین مقالات برای صفحه اصلی. */
export async function getLatestArticles(limit = 3) {
  const result = await getArticles({ pageSize: limit });
  return result.items;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleWithRelations | null> {
  const article = await findArticleBySlug(slug);
  if (!article || article.status !== "published") return null;

  const [withRelations] = await attachRelations([article]);
  return withRelations ?? null;
}

/** مقالات مرتبط: هم‌دسته، و در صورت کمبود، پربازدیدترین‌های دیگر. */
export async function getRelatedArticles(
  slug: string,
  limit = 3,
): Promise<ArticleWithRelations[]> {
  const current = await getArticleBySlug(slug);
  if (!current) return [];

  const all = await attachRelations(await findAllArticles());
  const candidates = all.filter(
    (article) => article.status === "published" && article.slug !== slug,
  );

  const sameCategory = candidates.filter(
    (article) => article.categoryId === current.categoryId,
  );
  const others = candidates
    .filter((article) => article.categoryId !== current.categoryId)
    .sort((a, b) => b.viewCount - a.viewCount);

  return [...sameCategory, ...others].slice(0, limit);
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const articles = await findAllArticles();
  return articles
    .filter((article) => article.status === "published")
    .map((article) => article.slug);
}

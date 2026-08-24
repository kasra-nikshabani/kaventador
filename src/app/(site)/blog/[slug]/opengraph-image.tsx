import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/seo/og-template";
import { getArticleBySlug } from "@/lib/services";
import { formatReadingTime } from "@/lib/utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "تصویر مقاله کاوِنتادور";

export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return renderOgCard({ title: "مقاله پیدا نشد" });
  }

  return renderOgCard({
    eyebrow: article.category.title,
    title: article.title,
    meta: `${article.author.name} · ${formatReadingTime(article.readingMinutes)}`,
  });
}

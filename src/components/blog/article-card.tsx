import { Clock, Eye } from "lucide-react";
import Link from "next/link";
import { CourseCover } from "@/components/course/course-cover";
import { Badge, Card } from "@/components/ui";
import { formatCompactNumber, formatDate, formatReadingTime } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

export interface ArticleCardProps {
  article: ArticleWithRelations;
  headingLevel?: "h2" | "h3";
}

export function ArticleCard({
  article,
  headingLevel: Heading = "h3",
}: ArticleCardProps) {
  return (
    <Card interactive className="group relative flex flex-col overflow-hidden">
      <CourseCover
        category={article.category}
        titleEn={article.category.titleEn}
        src={article.cover || undefined}
      />

      <div className="flex flex-1 flex-col p-5">
        <Badge variant="primary" className="mb-3 self-start">
          {article.category.title}
        </Badge>

        <Heading className="text-base leading-7 font-bold">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:outline-ring rounded after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {article.title}
          </Link>
        </Heading>

        <p className="text-muted mt-2 line-clamp-3 flex-1 text-sm">
          {article.excerpt}
        </p>

        <div className="text-subtle border-border mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-4 text-xs">
          <span>{article.author.name}</span>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {formatReadingTime(article.readingMinutes)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="size-3.5" aria-hidden="true" />
            {formatCompactNumber(article.viewCount)}
          </span>
        </div>
      </div>
    </Card>
  );
}

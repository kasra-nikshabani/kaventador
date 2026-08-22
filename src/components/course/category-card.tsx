import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui";
import { CategoryIcon } from "@/components/shared/category-icon";
import { formatNumber } from "@/lib/utils";
import type { CategoryWithStats } from "@/types";

export function CategoryCard({
  category,
  headingLevel: Heading = "h3",
}: {
  category: CategoryWithStats;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Card
      interactive
      style={{ "--category-color": category.color } as CSSProperties}
      className="group relative flex flex-col p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="bg-surface-2 flex size-12 items-center justify-center rounded-xl">
          <CategoryIcon
            icon={category.icon}
            className="size-6"
            style={{ color: "var(--category-color)" }}
          />
        </span>
        <ArrowLeft
          className="text-subtle group-hover:text-primary size-5 transition-transform duration-300 group-hover:-translate-x-1"
          aria-hidden="true"
        />
      </div>

      <Heading className="font-bold">
        <Link
          href={`/categories/${category.slug}`}
          className="focus-visible:outline-ring rounded after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {category.title}
        </Link>
      </Heading>

      <p className="text-muted mt-2 line-clamp-2 flex-1 text-sm">
        {category.description}
      </p>

      <p className="text-subtle mt-4 text-xs">
        {formatNumber(category.courseCount)} دوره ·{" "}
        {formatNumber(category.articleCount)} مقاله
      </p>
    </Card>
  );
}

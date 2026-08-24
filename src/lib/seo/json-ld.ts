import { siteConfig } from "@/config/site";
import type { ArticleWithRelations, CourseWithRelations } from "@/types";

/**
 * سازنده‌های داده ساختاریافته (JSON-LD).
 *
 * خروجی یک شیء ساده است؛ رندر آن با <script type="application/ld+json">
 * در خود صفحه انجام می‌شود.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    inLanguage: "fa-IR",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/courses?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** داده ساختاریافته صفحه دوره. */
export function courseJsonLd(course: CourseWithRelations) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.excerpt,
    url: `${siteConfig.url}/courses/${course.slug}`,
    inLanguage: "fa-IR",
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: course.category.title,
    teaches: course.outcomes,
    coursePrerequisites: course.prerequisites,
    educationalLevel: course.level,
    datePublished: course.publishedAt,
    dateModified: course.updatedAt,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      ratingCount: course.ratingCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      /* واحد داده تومان است ولی واحد رسمی ISO ریال؛ ضرب در ۱۰ لازم است
         وگرنه گوگل قیمت را ده برابر کمتر می‌فهمد. */
      price:
        course.pricing.type === "paid" ? course.pricing.amount * 10 : 0,
      priceCurrency: "IRR",
      category: course.pricing.type === "free" ? "Free" : "Paid",
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${Math.round(course.durationMinutes / 60)}H`,
      instructor: {
        "@type": "Person",
        name: course.instructor.name,
        jobTitle: course.instructor.role,
      },
    },
  };
}

/** مسیر ناوبری به شکل داده ساختاریافته. */
export function breadcrumbJsonLd(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { label: "خانه", href: "/" },
      ...items,
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

/** داده ساختاریافته صفحه مقاله. */
export function articleJsonLd(article: ArticleWithRelations) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: `${siteConfig.url}/blog/${article.slug}`,
    inLanguage: "fa-IR",
    articleSection: article.category.title,
    keywords: article.tags.join("، "),
    wordCount: article.content.trim().split(/\s+/).length,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${article.slug}`,
    },
  };
}

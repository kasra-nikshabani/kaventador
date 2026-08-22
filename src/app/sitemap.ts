import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  getAllArticleSlugs,
  getAllCategorySlugs,
  getAllCourseSlugs,
} from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courseSlugs, articleSlugs, categorySlugs] = await Promise.all([
    getAllCourseSlugs(),
    getAllArticleSlugs(),
    getAllCategorySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, priority: 1, changeFrequency: "daily" },
    { url: `${siteConfig.url}/courses`, priority: 0.9, changeFrequency: "daily" },
    { url: `${siteConfig.url}/categories`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${siteConfig.url}/blog`, priority: 0.8, changeFrequency: "daily" },
    { url: `${siteConfig.url}/about`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/contact`, priority: 0.5, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes,
    ...courseSlugs.map((slug) => ({
      url: `${siteConfig.url}/courses/${slug}`,
      priority: 0.9,
      changeFrequency: "weekly" as const,
    })),
    ...categorySlugs.map((slug) => ({
      url: `${siteConfig.url}/categories/${slug}`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
    })),
    ...articleSlugs.map((slug) => ({
      url: `${siteConfig.url}/blog/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}

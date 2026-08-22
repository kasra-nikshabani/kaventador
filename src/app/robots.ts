import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* پنل ادمین هرگز نباید ایندکس شود. */
      disallow: "/admin",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

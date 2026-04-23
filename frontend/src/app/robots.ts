import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/login",
          "/register",
          "/verify",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://cvmodifier.com/sitemap.xml",
    host: "https://cvmodifier.com",
  };
}

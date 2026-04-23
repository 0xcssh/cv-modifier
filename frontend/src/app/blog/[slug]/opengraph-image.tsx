import { ImageResponse } from "next/og";
import { getPostBySlug, BLOG_POSTS } from "@/lib/blog-posts";

export const alt = "Article CV Modifier";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender one OG image per article at build time.
export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogArticleOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Blog CV Modifier";
  const category = post?.category ?? "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 28,
              color: "#60a5fa",
              fontWeight: 600,
              display: "flex",
            }}
          >
            CV <span style={{ color: "white", marginLeft: 8 }}>Modifier</span>
          </div>
          <div
            style={{
              fontSize: 16,
              background: "#1e40af",
              color: "white",
              padding: "6px 14px",
              borderRadius: 999,
              marginLeft: 16,
              display: "flex",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {category}
          </div>
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.15,
            color: "white",
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>cvmodifier.com/blog</div>
          <div
            style={{
              display: "flex",
              color: "#60a5fa",
              fontWeight: 600,
            }}
          >
            Conseils carrière et CV
          </div>
        </div>
      </div>
    ),
    size,
  );
}

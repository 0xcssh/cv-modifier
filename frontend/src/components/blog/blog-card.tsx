import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { CATEGORY_STYLES, formatBlogDate } from "@/lib/blog-posts";
import type { BlogPost } from "@/lib/blog-posts";

export function BlogCard({
  post,
  priority = false,
}: {
  post: BlogPost;
  priority?: boolean;
}) {
  const cat = CATEGORY_STYLES[post.category];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={post.heroImage}
          alt={post.heroAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          priority={priority}
        />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cat.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
            {post.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} min
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <time dateTime={post.publishedAt}>
            {formatBlogDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  );
}

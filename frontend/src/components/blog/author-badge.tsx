import type { BlogAuthor } from "@/lib/blog-posts";
import { formatBlogDateLong } from "@/lib/blog-posts";
import { Clock } from "lucide-react";

export function AuthorBadge({
  author,
  updatedAt,
  readTime,
}: {
  author: BlogAuthor;
  updatedAt: string;
  readTime: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm"
          aria-hidden="true"
        >
          {author.avatarInitials}
        </div>
        <div>
          <p className="text-slate-900 font-semibold text-[15px] leading-tight">
            {author.name}
          </p>
          <p className="text-slate-500 text-[13px] leading-tight">
            {author.role}
          </p>
        </div>
      </div>
      <span aria-hidden="true" className="text-slate-300">
        ·
      </span>
      <span>Mis à jour le {formatBlogDateLong(updatedAt)}</span>
      <span aria-hidden="true" className="text-slate-300">
        ·
      </span>
      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 rounded-full px-2.5 py-1 text-xs font-medium">
        <Clock className="w-3.5 h-3.5" /> {readTime} min
      </span>
    </div>
  );
}

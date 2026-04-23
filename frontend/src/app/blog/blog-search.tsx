"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { BlogPost } from "@/lib/blog-posts";
import { BlogCard } from "@/components/blog/blog-card";

// Client-only component: handles the search input + filtered grid.
// The parent server component passes the full sorted posts list.
export function BlogSearch({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const haystack = `${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, posts]);

  return (
    <>
      <div className="relative max-w-xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article (ATS, lettre, mots-clés…)"
          className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-label="Rechercher un article"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">
            Aucun article ne correspond à « {query} ».
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 text-blue-600 hover:underline text-sm font-medium cursor-pointer"
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, idx) => (
            <BlogCard key={post.slug} post={post} priority={idx < 3} />
          ))}
        </div>
      )}
    </>
  );
}

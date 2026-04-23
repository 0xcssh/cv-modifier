import { List } from "lucide-react";

export function TableOfContents({
  headings,
}: {
  headings: { id: string; label: string }[];
}) {
  if (headings.length === 0) return null;
  return (
    <nav
      aria-label="Sommaire"
      className="my-8 rounded-xl bg-slate-50 border border-slate-200 p-5"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
        <List className="w-4 h-4 text-blue-600" />
        Sommaire
      </p>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="text-[15px] text-slate-700 hover:text-blue-600 hover:underline"
            >
              {h.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

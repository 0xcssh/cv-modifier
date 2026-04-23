import type { BlogSection } from "@/lib/blog-posts";
import { Callout } from "./callout";
import { CtaBox } from "./cta-box";

// Renders the structured `content` array of a blog post.
// Paragraphs may contain inline HTML (we author links via <a> in the source
// data); that's trusted content controlled by us, so dangerouslySetInnerHTML
// is acceptable here.
export function BlogContentRenderer({
  sections,
}: {
  sections: BlogSection[];
}) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="my-5 text-slate-700 leading-[1.75] text-[17px]"
                dangerouslySetInnerHTML={{ __html: section.text }}
              />
            );
          case "heading":
            if (section.level === 2) {
              return (
                <h2
                  key={i}
                  id={section.id}
                  className="scroll-mt-24 mt-12 mb-4 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
                >
                  {section.text}
                </h2>
              );
            }
            return (
              <h3
                key={i}
                id={section.id}
                className="scroll-mt-24 mt-8 mb-3 text-xl font-semibold text-slate-900"
              >
                {section.text}
              </h3>
            );
          case "list": {
            if (section.style === "numbered") {
              return (
                <ol
                  key={i}
                  className="my-5 space-y-2 list-decimal pl-6 text-slate-700 leading-[1.75] text-[17px] marker:text-blue-600 marker:font-semibold"
                >
                  {section.items.map((item, j) => (
                    <li key={j} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={i}
                className="my-5 space-y-2 list-disc pl-6 text-slate-700 leading-[1.75] text-[17px] marker:text-blue-600"
              >
                {section.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          case "callout":
            return (
              <Callout key={i} variant={section.variant} title={section.title}>
                {section.text}
              </Callout>
            );
          case "cta":
            return (
              <CtaBox
                key={i}
                title={section.title}
                text={section.text}
                ctaLabel={section.ctaLabel}
                ctaHref={section.ctaHref}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

// Minimal JSON-LD injector. One block per call, content fully
// controlled by us — dangerouslySetInnerHTML is safe.

type Props = {
  data: unknown | unknown[];
};

export function JsonLdScript({ data }: Props) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

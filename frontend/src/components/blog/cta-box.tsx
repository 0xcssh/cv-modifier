import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBox({
  title,
  text,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="my-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:p-8 text-white shadow-lg shadow-blue-600/10">
      <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
      <p className="text-blue-100 text-[15px] leading-relaxed mb-5">{text}</p>
      <Link href={ctaHref}>
        <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
          {ctaLabel}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

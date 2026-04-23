import { Info, AlertTriangle, Lightbulb } from "lucide-react";

type Variant = "info" | "warning" | "tip";

const STYLES: Record<
  Variant,
  { wrapper: string; icon: string; title: string; Icon: typeof Info }
> = {
  info: {
    wrapper: "bg-blue-50 border-l-4 border-blue-500",
    icon: "text-blue-600",
    title: "text-blue-900",
    Icon: Info,
  },
  warning: {
    wrapper: "bg-amber-50 border-l-4 border-amber-500",
    icon: "text-amber-600",
    title: "text-amber-900",
    Icon: AlertTriangle,
  },
  tip: {
    wrapper: "bg-emerald-50 border-l-4 border-emerald-500",
    icon: "text-emerald-600",
    title: "text-emerald-900",
    Icon: Lightbulb,
  },
};

export function Callout({
  variant,
  title,
  children,
}: {
  variant: Variant;
  title: string;
  children: React.ReactNode;
}) {
  const s = STYLES[variant];
  const { Icon } = s;
  return (
    <aside className={`my-6 rounded-r-xl px-5 py-4 ${s.wrapper}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${s.icon}`} />
        <div>
          <p className={`font-semibold mb-1 ${s.title}`}>{title}</p>
          <div className="text-slate-700 text-[15px] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}

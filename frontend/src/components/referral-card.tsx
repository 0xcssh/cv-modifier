"use client";

import { useEffect, useState } from "react";
import { Copy, Gift, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, type ReferralInfo } from "@/lib/api";

type Props = {
  /**
   * "compact" is used under the Generate form (tighter, single column).
   * "wide" is used on /dashboard/upgrade next to the pricing cards.
   */
  variant?: "compact" | "wide";
};

export function ReferralCard({ variant = "compact" }: Props) {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getMyReferralInfo()
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch(() => {
        // Silent — the card just won't render. Not worth blocking UX.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopy = async () => {
    if (!info) return;
    try {
      await navigator.clipboard.writeText(info.share_url);
      setCopied(true);
      toast.success("Lien copié dans le presse-papiers");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier — sélectionnez le lien manuellement");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center min-h-[160px]">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!info) return null;

  const isWide = variant === "wide";

  return (
    <div
      className={`rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 ${
        isWide ? "md:p-8" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base md:text-lg">
            Gagne {info.reward_referrer} crédits par ami parrainé
          </h3>
          <p className="text-sm text-slate-600">
            Ton ami reçoit +{info.reward_referee} crédit bonus à
            l&apos;inscription.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="referral-link"
          className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
        >
          Ton lien de parrainage
        </label>
        <div className="flex gap-2">
          <input
            id="referral-link"
            type="text"
            readOnly
            value={info.share_url}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copié
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copier
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

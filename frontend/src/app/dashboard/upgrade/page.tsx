"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Check, Crown, Loader2, Settings, Sparkles, Gift } from "lucide-react";
import { ReferralCard } from "@/components/referral-card";

type Plan = "starter" | "pro" | "pack_10" | "pack_30";

interface TierDef {
  id: Plan;
  name: string;
  price: string;
  suffix: string;
  detail: string;
  tagline: string;
  features: string[];
  highlight: boolean;
  ctaVariant: "primary" | "outline";
}

const SUBSCRIPTIONS: TierDef[] = [
  {
    id: "starter",
    name: "Starter",
    price: "9,99",
    suffix: "€/mois",
    detail: "20 crédits/mois",
    tagline: "Pour postuler régulièrement",
    features: [
      "20 crédits par mois",
      "Support par email",
      "Accès aux 4 templates",
    ],
    highlight: false,
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    price: "19,99",
    suffix: "€/mois",
    detail: "50 crédits/mois",
    tagline: "Pour une recherche active",
    features: [
      "50 crédits par mois",
      "Support prioritaire",
      "Accès aux 4 templates",
      "Historique illimité",
    ],
    highlight: true,
    ctaVariant: "primary",
  },
];

const PACKS: TierDef[] = [
  {
    id: "pack_10",
    name: "Pack 10 crédits",
    price: "4,99",
    suffix: "€",
    detail: "10 crédits ajoutés",
    tagline: "Sans engagement",
    features: [
      "10 crédits ajoutés immédiatement",
      "Sans engagement",
      "Valables à vie",
    ],
    highlight: false,
    ctaVariant: "outline",
  },
  {
    id: "pack_30",
    name: "Pack 30 crédits",
    price: "12,99",
    suffix: "€",
    detail: "30 crédits ajoutés",
    tagline: "Meilleur rapport qualité-prix",
    features: [
      "30 crédits ajoutés immédiatement",
      "Sans engagement",
      "Valables à vie",
      "-13% vs pack 10",
    ],
    highlight: false,
    ctaVariant: "primary",
  },
];

function UpgradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState<Plan | "portal" | null>(null);

  // Detect current subscription via subscription_tier (MVP indicator).
  // "free" (or missing) = no active sub; anything else = active sub.
  const activeTier = user?.subscription_tier ?? "free";
  const hasActiveSubscription = activeTier !== "free";

  useEffect(() => {
    const success = searchParams.get("success");
    const cancel = searchParams.get("cancel");

    if (success === "true") {
      toast.success(
        "Paiement réussi, vos crédits arrivent dans quelques secondes"
      );
      // Webhook processes the payment async — refresh after a short delay.
      const t = setTimeout(() => {
        refreshUser();
      }, 3000);
      // Clean the query params so refreshes don't re-trigger the toast.
      router.replace("/dashboard/upgrade");
      return () => clearTimeout(t);
    }

    if (cancel === "true") {
      toast.info("Paiement annulé");
      router.replace("/dashboard/upgrade");
    }
    // We intentionally react only to searchParams changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCheckout = async (plan: Plan) => {
    setLoading(plan);
    try {
      const { url } = await api.createCheckoutSession(plan);
      window.location.href = url;
    } catch {
      toast.error("Impossible de démarrer le paiement");
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const { url } = await api.createPortalSession();
      window.location.href = url;
    } catch {
      toast.error("Impossible d'ouvrir le portail de gestion");
      setLoading(null);
    }
  };

  const renderCard = (tier: TierDef) => {
    const isCurrentPlan =
      hasActiveSubscription && tier.id === activeTier;
    const isLoadingThis = loading === tier.id;
    const isDisabled = isCurrentPlan || loading !== null;

    const baseCardClasses =
      "relative bg-white rounded-2xl p-6 shadow-sm flex flex-col";
    const cardBorder = tier.highlight
      ? "border-2 border-blue-600"
      : "border border-slate-200";

    const primaryBtn =
      "w-full bg-blue-600 hover:bg-blue-700 text-white";
    const outlineBtn = "w-full";
    const currentPlanBtn =
      "w-full bg-slate-100 text-slate-500 cursor-not-allowed hover:bg-slate-100";

    return (
      <div key={tier.id} className={`${baseCardClasses} ${cardBorder}`}>
        {tier.highlight && !isCurrentPlan && (
          <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Populaire
          </div>
        )}
        {isCurrentPlan && (
          <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Actif
          </div>
        )}

        <h3 className="font-semibold text-slate-900 text-lg">{tier.name}</h3>
        <p className="text-sm text-slate-500 mb-4">{tier.tagline}</p>

        <div className="mb-1">
          <span className="text-3xl font-bold text-slate-900">
            {tier.price}
          </span>
          <span className="text-base font-normal text-slate-500 ml-1">
            {tier.suffix}
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-5">{tier.detail}</p>

        <ul className="space-y-2.5 mb-6 flex-1">
          {tier.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {isCurrentPlan ? (
          <Button disabled className={currentPlanBtn}>
            Plan actuel
          </Button>
        ) : (
          <Button
            onClick={() => handleCheckout(tier.id)}
            disabled={isDisabled}
            variant={tier.ctaVariant === "primary" ? "default" : "outline"}
            className={tier.ctaVariant === "primary" ? primaryBtn : outlineBtn}
          >
            {isLoadingThis ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Redirection...
              </>
            ) : (
              "Choisir"
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Crown className="w-7 h-7 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">
          Rechargez vos crédits
        </h1>
      </div>
      <p className="text-slate-500 mb-10">
        1 crédit = 1 CV + 1 lettre adaptés par l&apos;IA
      </p>

      {hasActiveSubscription && (
        <div className="mb-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Gérer mon abonnement
              </h2>
              <p className="text-sm text-slate-500">
                Modifier, mettre en pause ou annuler votre abonnement via
                Stripe.
              </p>
            </div>
          </div>
          <Button
            onClick={handlePortal}
            disabled={loading !== null}
            variant="outline"
            className="sm:flex-shrink-0"
          >
            {loading === "portal" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Redirection...
              </>
            ) : (
              "Ouvrir le portail Stripe"
            )}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Abonnements</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {SUBSCRIPTIONS.map(renderCard)}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Packs à l&apos;unité
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {PACKS.map(renderCard)}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Ou gratuitement via parrainage
        </h2>
      </div>
      <ReferralCard variant="wide" />

      <p className="text-xs text-slate-400 text-center mt-8">
        Paiements sécurisés par Stripe. Annulation possible à tout moment.
      </p>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      }
    >
      <UpgradeContent />
    </Suspense>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Check, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "9,99",
    period: "/mois",
    credits: "30 générations/mois",
    popular: true,
    features: [
      "30 CV + lettres par mois",
      "Historique complet",
      "Extraction CV automatique",
      "Support prioritaire",
    ],
  },
  {
    name: "Pro",
    price: "19,99",
    period: "/mois",
    credits: "100 générations/mois",
    popular: false,
    features: [
      "100 CV + lettres par mois",
      "Tout le plan Starter",
      "Génération prioritaire",
      "Templates multiples (bientôt)",
    ],
  },
];

const packs = [
  { credits: 5, price: "4,99" },
  { credits: 15, price: "9,99" },
  { credits: 30, price: "14,99" },
];

export default function UpgradePage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Crown className="w-7 h-7 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Upgrader</h1>
      </div>
      <p className="text-slate-500 mb-10">
        Choisissez un abonnement ou achetez des crédits à la carte.
      </p>

      {/* Subscriptions */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Abonnements</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 border-2 bg-white relative ${
              plan.popular ? "border-blue-600 shadow-lg" : "border-slate-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Populaire
              </div>
            )}
            <h3 className="font-semibold text-slate-900 text-lg">{plan.name}</h3>
            <p className="text-sm text-slate-400 mb-3">{plan.credits}</p>
            <div className="text-3xl font-bold text-slate-900 mb-4">
              {plan.price}&euro;
              <span className="text-base font-normal text-slate-400">{plan.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${
                plan.popular
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : ""
              }`}
              variant={plan.popular ? "default" : "outline"}
            >
              Choisir {plan.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Credit packs */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Crédits à la carte</h2>
      <p className="text-slate-500 text-sm mb-4">
        Achetez des crédits sans abonnement. Pas d&apos;expiration.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {packs.map((pack) => (
          <div
            key={pack.credits}
            className="rounded-xl border border-slate-200 bg-white p-5 text-center hover:border-blue-300 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{pack.credits} crédits</div>
            <div className="text-sm text-slate-400 mb-4">{pack.price}&euro;</div>
            <Button variant="outline" className="w-full" size="sm">
              Acheter
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center mt-8">
        Le paiement sera intégré prochainement via Stripe. Contactez-nous pour un accès anticipé.
      </p>
    </div>
  );
}

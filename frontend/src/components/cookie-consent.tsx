"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay slightly to avoid flashing the banner during hydration.
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored !== "accepted") {
          setVisible(true);
        }
      } catch {
        // localStorage may be unavailable (private mode, SSR edge cases) — show by default.
        setVisible(true);
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Ignore storage errors — just hide the banner for this session.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Bandeau de consentement cookies"
      className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto bg-slate-900 text-white rounded-xl shadow-xl p-4 z-50 border border-slate-800"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <p className="text-sm leading-relaxed flex-1">
          Nous utilisons des cookies essentiels au fonctionnement du site
          (authentification). Aucun cookie publicitaire ou de suivi n&apos;est
          déposé sans votre consentement.
        </p>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            href="/legal/cookies"
            className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
          >
            En savoir plus
          </Link>
          <button
            type="button"
            onClick={handleAccept}
            className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;

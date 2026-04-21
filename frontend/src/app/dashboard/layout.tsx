"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Zap, Clock, User, LogOut, CreditCard, Crown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard/generate", icon: Zap, label: "Générer" },
  { href: "/dashboard/history", icon: Clock, label: "Historique" },
  { href: "/dashboard/profile", icon: User, label: "Profil" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, credits, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <Link href="/dashboard/generate" className="text-xl font-bold text-slate-900">
          CV <span className="text-blue-600">Modifier</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-slate-900"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Credits */}
      <div className="px-4 py-4">
        <div className={`rounded-xl p-4 border ${credits <= 0 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100"}`}>
          <div className={`flex items-center gap-2 text-sm font-medium mb-1 ${credits <= 0 ? "text-red-600" : "text-blue-600"}`}>
            <CreditCard className="w-4 h-4" />
            Crédits restants
          </div>
          <div className="text-2xl font-bold text-slate-900">{credits}</div>
          <p className="text-xs text-slate-400 mt-1">1 crédit = 1 CV + 1 lettre</p>
          <Link href="/dashboard/upgrade">
            <button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              {credits <= 0 ? "Recharger mes crédits" : "Upgrader"}
            </button>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-500 hover:text-slate-900"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4">
        <Link href="/dashboard/generate" className="text-lg font-bold text-slate-900">
          CV <span className="text-blue-600">Modifier</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate-700"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

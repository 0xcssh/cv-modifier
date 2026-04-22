"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { api, UserData, ProfileData } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  profile: ProfileData | null;
  loading: boolean;
  credits: number;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = api.getToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      setCredits(0);
      setLoading(false);
      return;
    }

    const [meResult, profileResult] = await Promise.allSettled([
      api.getMe(),
      api.getProfile(),
    ]);

    if (meResult.status === "fulfilled") {
      setUser(meResult.value);
      setCredits(meResult.value.credits);
      setIsAuthenticated(true);
    } else {
      if (!api.getToken()) {
        setIsAuthenticated(false);
        setUser(null);
        setCredits(0);
      }
      setLoading(false);
      return;
    }

    setProfile(profileResult.status === "fulfilled" ? profileResult.value : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    await api.login(email, password);
    await loadUser();
  };

  const register = async (email: string, password: string) => {
    await api.register(email, password);
    await api.login(email, password);
    await loadUser();
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    setCredits(0);
  };

  const refreshProfile = async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
    } catch {
      setProfile(null);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
      setCredits(me.credits);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, profile, loading, credits, login, register, logout, refreshProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { Role, User } from "./types";

/* ---------------------------------------------------------------------------
 * MOCK AUTHENTICATION
 * ---------------------------------------------------------------------------
 * This is a deliberately thin, front-end-only stand-in so the three portals are
 * walkable without a backend. The session is kept in localStorage.
 *
 * To wire your own provider (Lovable Cloud / Supabase, Auth0, your own API):
 *   - signIn(): call your endpoint, then setUser() with the returned profile.
 *   - signOut(): call your revoke/logout endpoint, then setUser(null).
 *   - Replace the `useEffect` restore with your own session/token check.
 *   - Enforce roles on the server too — `RequireRole` below is UI-level only.
 * ------------------------------------------------------------------------- */

const STORAGE_KEY = "afadhali.session";

const demoUsers: Record<Role, User> = {
  admin: {
    id: "us-01",
    name: "Afadhali Admin",
    email: "admin@afadhali.co",
    role: "admin",
    status: "active",
  },
  client: {
    id: "us-02",
    name: "Achieng Otieno",
    email: "ops@kisumusteel.co.ke",
    role: "client",
    organisationId: "cl-01",
    organisationName: "Kisumu Steel Works",
    status: "active",
  },
  partner: {
    id: "us-03",
    name: "Samuel Kariuki",
    email: "projects@biogaske.com",
    role: "partner",
    organisationId: "pa-02",
    organisationName: "Biogas Kenya Engineering",
    status: "active",
  },
};

export const roleHome: Record<Role, string> = {
  admin: "/admin",
  client: "/client",
  partner: "/partner",
};

interface AuthValue {
  user: User | null;
  ready: boolean;
  signIn: (role: Role, email?: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // TODO(auth): replace with your own session restore (token check / getUser()).
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const signIn: AuthValue["signIn"] = async (role, email) => {
    // TODO(auth): POST credentials to your provider and use the returned user.
    const next = { ...demoUsers[role], ...(email ? { email } : {}) };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
    return next;
  };

  const signOut: AuthValue["signOut"] = async () => {
    // TODO(auth): revoke the session with your provider here.
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

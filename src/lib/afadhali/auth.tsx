import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "./supabase";
import type { Role, User } from "./types";

export const roleHome: Record<Role, string> = {
  admin: "/admin",
  client: "/client",
  partner: "/partner",
};

interface AuthValue {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

async function loadProfile(session: Session): Promise<User> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !data) throw error ?? new Error("Profile not found");

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    organisationId: data.organisation_id ?? undefined,
    organisationName: data.organisation_name ?? undefined,
    status: data.status,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) setUser(await loadProfile(session));
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(await loadProfile(session));
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn: AuthValue["signIn"] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await loadProfile(data.session);
    setUser(profile);
    return profile;
  };

  const signOut: AuthValue["signOut"] = async () => {
    await supabase.auth.signOut();
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

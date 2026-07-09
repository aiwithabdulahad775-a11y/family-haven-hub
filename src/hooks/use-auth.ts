import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "user" | "counselor" | "content_manager" | "admin";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s?.user) setRoles([]);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        setRoles(((data ?? []).map((r) => r.role)) as AppRole[]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    session,
    user,
    roles,
    loading,
    isAuthenticated: !!user,
    hasRole: (r: AppRole) => roles.includes(r),
    signOut: () => supabase.auth.signOut(),
  };
}

export function landingPathForRoles(roles: AppRole[]): string {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("content_manager")) return "/content";
  if (roles.includes("counselor")) return "/counselor";
  return "/profile";
}

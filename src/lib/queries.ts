import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mapContent, mapCase, mapCounselor } from "@/lib/mappers";
import type { SectionKey } from "@/lib/app-types";

export function useContent(section?: SectionKey, type?: "article" | "video" | "pdf", search?: string) {
  const q = (search ?? "").trim();
  return useQuery({
    queryKey: ["content", section ?? "all", type ?? "all", q],
    queryFn: async () => {
      let query = supabase.from("content_items").select("*").eq("is_published", true).is("deleted_at", null).order("created_at", { ascending: false });
      if (section) query = query.eq("section", section);
      if (type) query = query.eq("type", type);
      if (q) {
        const like = `%${q.replace(/[%_]/g, "")}%`;
        query = query.or(`title_en.ilike.${like},title_ur.ilike.${like},excerpt_en.ilike.${like},excerpt_ur.ilike.${like}`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapContent);
    },
  });
}

export function useCases() {
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("case_studies").select("*").eq("is_published", true).is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapCase);
    },
  });
}

export function useCounselors() {
  return useQuery({
    queryKey: ["counselors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("counselors").select("*").eq("is_active", true).order("years", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapCounselor);
    },
  });
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useNotifications(userId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`notif-${userId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => {
        qc.invalidateQueries({ queryKey: ["notifications", userId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [userId, qc]);
  return query;
}

export function useSavedItems(userId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["saved", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_items").select("*").eq("user_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`saved-${userId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "saved_items", filter: `user_id=eq.${userId}` }, () => {
        qc.invalidateQueries({ queryKey: ["saved", userId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [userId, qc]);
  return query;
}

export function useToggleSave(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ kind, itemId, isSaved }: { kind: "content" | "case_study"; itemId: string; isSaved: boolean }) => {
      if (!userId) throw new Error("Sign in required");
      if (isSaved) {
        const { error } = await supabase.from("saved_items").delete().eq("user_id", userId).eq("item_kind", kind).eq("item_id", itemId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saved_items").insert({ user_id: userId, item_kind: kind, item_id: itemId });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved", userId] }),
  });
}

export function useCounselingRequests(userId: string | undefined) {
  return useQuery({
    queryKey: ["counseling", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("counseling_requests").select("*, counselors(name)").eq("user_id", userId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

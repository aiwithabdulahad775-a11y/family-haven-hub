import type { Database } from "@/integrations/supabase/types";
import type { Article, CaseStudy, Counselor, SectionKey } from "@/lib/app-types";

type ContentRow = Database["public"]["Tables"]["content_items"]["Row"];
type CaseRow = Database["public"]["Tables"]["case_studies"]["Row"];
type CounselorRow = Database["public"]["Tables"]["counselors"]["Row"];

export function mapContent(r: ContentRow): Article {
  return {
    id: r.id,
    section: (r.section as SectionKey) ?? "family",
    title: { en: r.title_en, ur: r.title_ur },
    excerpt: { en: r.excerpt_en ?? "", ur: r.excerpt_ur ?? "" },
    body: { en: r.body_en ?? "", ur: r.body_ur ?? "" },
    media_url: r.media_url,
    minutes: r.minutes ?? 0,
    type: r.type,
    hue: r.hue ?? 220,
  };
}

export function mapCase(r: CaseRow): CaseStudy {
  return {
    id: r.id,
    title: { en: r.title_en, ur: r.title_ur },
    excerpt: { en: r.excerpt_en ?? "", ur: r.excerpt_ur ?? "" },
    body: { en: r.body_en ?? "", ur: r.body_ur ?? "" },
    category: { en: r.category_en ?? "", ur: r.category_ur ?? "" },
    hue: r.hue ?? 220,
  };
}

export function mapCounselor(r: CounselorRow): Counselor {
  return {
    id: r.id,
    name: r.name,
    role: { en: r.role_en ?? "", ur: r.role_ur ?? "" },
    focus: { en: r.focus_en ?? "", ur: r.focus_ur ?? "" },
    years: r.years ?? 0,
    initials: r.initials ?? r.name.slice(0, 2).toUpperCase(),
    hue: r.hue ?? 220,
  };
}

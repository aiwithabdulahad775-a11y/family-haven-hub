// Shared UI types + section catalog. Real data lives in Supabase; this file
// holds only the type shapes the mappers produce and the section order used
// across navigation.

export type SectionKey = "zaujain" | "aulad" | "parenting" | "marriage" | "family";

export const sectionOrder: SectionKey[] = ["zaujain", "aulad", "parenting", "marriage", "family"];

export type Article = {
  id: string;
  section: SectionKey;
  title: { en: string; ur: string };
  excerpt: { en: string; ur: string };
  body: { en: string; ur: string };
  minutes: number;
  type: "article" | "video" | "pdf";
  hue: number;
  media_url?: string | null;
};

export type CaseStudy = {
  id: string;
  title: { en: string; ur: string };
  excerpt: { en: string; ur: string };
  body: { en: string; ur: string };
  category: { en: string; ur: string };
  hue: number;
};

export type Counselor = {
  id: string;
  name: string;
  role: { en: string; ur: string };
  focus: { en: string; ur: string };
  years: number;
  initials: string;
  hue: number;
};

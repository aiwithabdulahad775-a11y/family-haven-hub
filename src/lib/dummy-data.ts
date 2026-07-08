export type Article = {
  id: string;
  section: SectionKey;
  title: { en: string; ur: string };
  excerpt: { en: string; ur: string };
  minutes: number;
  type: "article" | "video" | "pdf";
  hue: number; // for gradient placeholder
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

export type SectionKey = "zaujain" | "aulad" | "parenting" | "marriage" | "family";

export const sectionOrder: SectionKey[] = ["zaujain", "aulad", "parenting", "marriage", "family"];

export const articles: Article[] = [
  {
    id: "a1",
    section: "zaujain",
    title: { en: "Building mercy in marriage", ur: "نکاح میں رحمت پیدا کرنا" },
    excerpt: {
      en: "Small daily habits that grow lasting affection between spouses.",
      ur: "روزمرہ کی چھوٹی عادات جو میاں بیوی میں پائیدار محبت پیدا کرتی ہیں۔",
    },
    minutes: 6,
    type: "article",
    hue: 220,
  },
  {
    id: "a2",
    section: "zaujain",
    title: { en: "Listening without fixing", ur: "بغیر حل بتائے سننا" },
    excerpt: {
      en: "A gentle framework for conversations that heal instead of harm.",
      ur: "ایسی گفتگو کا نرم طریقہ جو زخم نہیں بھرتا بلکہ شفا دیتا ہے۔",
    },
    minutes: 4,
    type: "article",
    hue: 210,
  },
  {
    id: "a3",
    section: "aulad",
    title: { en: "Raising confident children", ur: "خود اعتماد بچوں کی پرورش" },
    excerpt: {
      en: "Encouragement patterns that build inner steadiness.",
      ur: "حوصلہ افزائی کے وہ طریقے جو اندرونی سکون پیدا کرتے ہیں۔",
    },
    minutes: 7,
    type: "article",
    hue: 45,
  },
  {
    id: "a4",
    section: "aulad",
    title: { en: "Screens and family time", ur: "اسکرین اور خاندانی وقت" },
    excerpt: {
      en: "Simple boundaries that keep bedrooms and dinners device-free.",
      ur: "آسان حدود جو بستر اور کھانا آلات سے پاک رکھتی ہیں۔",
    },
    minutes: 5,
    type: "video",
    hue: 30,
  },
  {
    id: "a5",
    section: "parenting",
    title: { en: "The calm-parenting playbook", ur: "پُرسکون والدین کا رہنما" },
    excerpt: {
      en: "Respond, don't react. A tested rhythm for hard mornings.",
      ur: "ردعمل نہیں، جواب دیں۔ مشکل صبحوں کے لیے آزمودہ ترتیب۔",
    },
    minutes: 9,
    type: "pdf",
    hue: 260,
  },
  {
    id: "a6",
    section: "marriage",
    title: { en: "Money, mercy, and marriage", ur: "پیسہ، رحمت اور نکاح" },
    excerpt: {
      en: "A monthly ritual to talk finances without friction.",
      ur: "بغیر جھگڑے مالی گفتگو کے لیے ماہانہ عمل۔",
    },
    minutes: 8,
    type: "article",
    hue: 190,
  },
  {
    id: "a7",
    section: "family",
    title: { en: "In-laws with grace", ur: "سسرال کے ساتھ خوش اسلوبی" },
    excerpt: {
      en: "Boundaries that protect love on both sides.",
      ur: "ایسی حدود جو دونوں طرف کی محبت کو محفوظ رکھیں۔",
    },
    minutes: 6,
    type: "article",
    hue: 340,
  },
  {
    id: "a8",
    section: "family",
    title: { en: "The dinner table blueprint", ur: "دسترخوان کا خاکہ" },
    excerpt: {
      en: "A 20-minute nightly ritual that keeps a household close.",
      ur: "روزانہ 20 منٹ کا عمل جو گھر کو قریب رکھتا ہے۔",
    },
    minutes: 5,
    type: "video",
    hue: 160,
  },
  {
    id: "a9",
    section: "marriage",
    title: { en: "Repair after a hard week", ur: "مشکل ہفتے کے بعد جوڑ" },
    excerpt: {
      en: "A short repair conversation that actually lands.",
      ur: "ایک مختصر گفتگو جو دل تک پہنچتی ہے۔",
    },
    minutes: 4,
    type: "pdf",
    hue: 280,
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "c1",
    title: { en: "The quiet reconciliation", ur: "خاموش صلح" },
    excerpt: {
      en: "How a couple rebuilt trust after a year of silence.",
      ur: "ایک سالہ خاموشی کے بعد جوڑے نے اعتماد کیسے دوبارہ بنایا۔",
    },
    body: {
      en: "Ahmed and Sara had drifted for months. Small resentments hardened into silence. A weekly 20-minute check-in — no phones, no arguments, only listening — slowly opened the door again…",
      ur: "احمد اور سارہ کئی ماہ سے دور ہو گئے تھے۔ چھوٹی ناراضگیاں خاموشی میں بدل گئیں۔ ہفتہ وار 20 منٹ کی ملاقات — بغیر فون، بغیر بحث، صرف سننا — نے آہستہ آہستہ دروازہ دوبارہ کھول دیا…",
    },
    category: { en: "Marriage", ur: "نکاح" },
    hue: 220,
  },
  {
    id: "c2",
    title: { en: "A teenager coming home", ur: "نوجوان کا واپس آنا" },
    excerpt: {
      en: "Parents who traded lectures for curiosity — and got their son back.",
      ur: "والدین جنہوں نے لیکچر چھوڑ کر تجسس اپنایا اور بیٹا واپس پایا۔",
    },
    body: {
      en: "Their 15-year-old had stopped speaking at dinner. Instead of confrontation, they began asking one open-ended question a night. It took three months, but the door opened…",
      ur: "پندرہ سال کے بیٹے نے کھانے پر بات کرنا چھوڑ دیا تھا۔ سختی کے بجائے، انہوں نے روز ایک کھلا سوال پوچھنا شروع کیا۔ تین ماہ لگے، مگر دروازہ کھل گیا…",
    },
    category: { en: "Parenting", ur: "پرورش" },
    hue: 45,
  },
  {
    id: "c3",
    title: { en: "Two households, one child", ur: "دو گھر، ایک بچہ" },
    excerpt: {
      en: "Coordinating co-parenting without competing.",
      ur: "بغیر مقابلے کے مشترکہ پرورش۔",
    },
    body: {
      en: "After separation, they built a shared calendar and a single set of rules. The child stopped feeling like a courier between two worlds…",
      ur: "علیحدگی کے بعد، انہوں نے مشترکہ کیلنڈر اور یکساں اصول بنائے۔ بچے نے دو دنیاؤں کے درمیان قاصد ہونا محسوس کرنا چھوڑ دیا…",
    },
    category: { en: "Family", ur: "خاندان" },
    hue: 160,
  },
  {
    id: "c4",
    title: { en: "The in-law boundary", ur: "سسرال کی حد" },
    excerpt: {
      en: "A daughter-in-law found kindness that also protects her.",
      ur: "بہو نے ایسی نرمی پائی جو حفاظت بھی کرے۔",
    },
    body: {
      en: "She stopped saying yes to every request and started saying 'let me check with my husband.' Two months later, the relationship softened…",
      ur: "اس نے ہر بات پر ہاں کہنا چھوڑا اور 'میں شوہر سے پوچھ لیتی ہوں' کہنا شروع کیا۔ دو ماہ بعد رشتہ نرم ہو گیا…",
    },
    category: { en: "Family", ur: "خاندان" },
    hue: 340,
  },
];

export const counselors: Counselor[] = [
  {
    id: "cn1",
    name: "Dr. Amina Rahman",
    role: { en: "Family therapist", ur: "خاندانی معالج" },
    focus: { en: "Marriage & communication", ur: "نکاح اور گفتگو" },
    years: 12,
    initials: "AR",
    hue: 220,
  },
  {
    id: "cn2",
    name: "Ustadh Yusuf Khan",
    role: { en: "Islamic family counselor", ur: "اسلامی خاندانی مشیر" },
    focus: { en: "Youth & parenting", ur: "نوجوان اور پرورش" },
    years: 9,
    initials: "YK",
    hue: 45,
  },
  {
    id: "cn3",
    name: "Sadia Malik, MSW",
    role: { en: "Clinical social worker", ur: "کلینیکل سماجی کارکن" },
    focus: { en: "Conflict & repair", ur: "تنازعہ اور مصالحت" },
    years: 7,
    initials: "SM",
    hue: 340,
  },
];

export const notifications = [
  {
    id: "n1",
    title: { en: "New article in Al-Zaujain", ur: "الزوجین میں نیا مضمون" },
    body: { en: "Building mercy in marriage — 6 min read.", ur: "نکاح میں رحمت — 6 منٹ کا مطالعہ۔" },
    unread: true,
    when: { en: "2h ago", ur: "2 گھنٹے پہلے" },
  },
  {
    id: "n2",
    title: { en: "Your saved video is ready", ur: "آپ کی محفوظ ویڈیو تیار" },
    body: { en: "Screens and family time is now available.", ur: "'اسکرین اور خاندانی وقت' اب دستیاب ہے۔" },
    unread: true,
    when: { en: "Yesterday", ur: "کل" },
  },
  {
    id: "n3",
    title: { en: "Counselor appointment reminder", ur: "مشیر ملاقات یاد دہانی" },
    body: { en: "Your visual appointment is on Friday, 4pm.", ur: "آپ کی ملاقات جمعہ شام 4 بجے ہے۔" },
    unread: false,
    when: { en: "3d ago", ur: "3 دن پہلے" },
  },
];


-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('user', 'counselor', 'content_manager', 'admin');
CREATE TYPE public.content_type AS ENUM ('article', 'video', 'pdf');
CREATE TYPE public.counseling_status AS ENUM ('pending', 'assigned', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('system', 'content', 'counseling', 'announcement');

-- ============ HELPERS ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  gender TEXT CHECK (gender IN ('male','female','other')),
  date_of_birth DATE,
  country TEXT,
  city TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en','ur')),
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light','dark')),
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','suspended','deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.current_user_roles()
RETURNS SETOF public.app_role LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid();
$$;

-- ============ NEW USER TRIGGER (profile + default role; first user = admin) ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count <= 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile policies
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counselor'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- User_roles policies
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ur TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Content managers manage categories" ON public.categories FOR ALL
  USING (public.has_role(auth.uid(),'content_manager') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'content_manager') OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cat_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CONTENT ITEMS (articles / videos / pdfs unified) ============
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.content_type NOT NULL,
  section TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_ur TEXT,
  body_en TEXT,
  body_ur TEXT,
  minutes INT DEFAULT 0,
  hue INT DEFAULT 220,
  media_url TEXT,
  is_published BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_section ON public.content_items(section);
CREATE INDEX idx_content_type ON public.content_items(type);
GRANT SELECT ON public.content_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Content public read" ON public.content_items FOR SELECT USING (is_published = true AND deleted_at IS NULL);
CREATE POLICY "Content managers manage content" ON public.content_items FOR ALL
  USING (public.has_role(auth.uid(),'content_manager') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'content_manager') OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_content_updated BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CASE STUDIES ============
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_ur TEXT,
  body_en TEXT,
  body_ur TEXT,
  category_en TEXT,
  category_ur TEXT,
  hue INT DEFAULT 220,
  is_published BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cases public read" ON public.case_studies FOR SELECT USING (is_published = true AND deleted_at IS NULL);
CREATE POLICY "Managers manage cases" ON public.case_studies FOR ALL
  USING (public.has_role(auth.uid(),'content_manager') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'content_manager') OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_case_updated BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ COUNSELORS ============
CREATE TABLE public.counselors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role_en TEXT,
  role_ur TEXT,
  focus_en TEXT,
  focus_ur TEXT,
  years INT DEFAULT 0,
  initials TEXT,
  hue INT DEFAULT 220,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.counselors TO anon, authenticated;
GRANT ALL ON public.counselors TO service_role;
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Counselors public read" ON public.counselors FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage counselors" ON public.counselors FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_counselors_updated BEFORE UPDATE ON public.counselors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ COUNSELING REQUESTS ============
CREATE TABLE public.counseling_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  description TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status public.counseling_status NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_counseling_user ON public.counseling_requests(user_id);
CREATE INDEX idx_counseling_counselor ON public.counseling_requests(counselor_id);
GRANT SELECT, INSERT, UPDATE ON public.counseling_requests TO authenticated;
GRANT ALL ON public.counseling_requests TO service_role;
ALTER TABLE public.counseling_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own requests" ON public.counseling_requests FOR SELECT
  USING (auth.uid() = user_id
    OR public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'counselor') AND counselor_id IN (SELECT id FROM public.counselors WHERE user_id = auth.uid())));
CREATE POLICY "Users create own requests" ON public.counseling_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Counselors update assigned" ON public.counseling_requests FOR UPDATE
  USING (public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'counselor') AND counselor_id IN (SELECT id FROM public.counselors WHERE user_id = auth.uid())));
CREATE TRIGGER trg_creq_updated BEFORE UPDATE ON public.counseling_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ COUNSELING NOTES ============
CREATE TABLE public.counseling_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.counseling_requests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.counseling_notes TO authenticated;
GRANT ALL ON public.counseling_notes TO service_role;
ALTER TABLE public.counseling_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Counselors/admins read notes" ON public.counseling_notes FOR SELECT
  USING (public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'counselor') AND request_id IN (
      SELECT cr.id FROM public.counseling_requests cr
      JOIN public.counselors c ON c.id = cr.counselor_id
      WHERE c.user_id = auth.uid())));
CREATE POLICY "Counselors/admins add notes" ON public.counseling_notes FOR INSERT
  WITH CHECK (auth.uid() = author_id AND
    (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counselor')));

-- ============ SAVED ITEMS (polymorphic) ============
CREATE TABLE public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_kind TEXT NOT NULL CHECK (item_kind IN ('content','case_study')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_kind, item_id)
);
CREATE INDEX idx_saved_user ON public.saved_items(user_id);
GRANT SELECT, INSERT, DELETE ON public.saved_items TO authenticated;
GRANT ALL ON public.saved_items TO service_role;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saves" ON public.saved_items FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL DEFAULT 'system',
  title_en TEXT NOT NULL,
  title_ur TEXT,
  body_en TEXT,
  body_ur TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifs" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifs" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifs" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.counseling_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_items;

-- ============ SEED CONTENT ============
INSERT INTO public.categories (slug, name_en, name_ur, sort_order) VALUES
  ('zaujain','Al-Zaujain','الزوجین',1),
  ('aulad','Al-Aulad','الاولاد',2),
  ('parenting','Parenting','پرورش',3),
  ('marriage','Marriage','نکاح',4),
  ('family','Family','خاندان',5);

INSERT INTO public.content_items (type, section, title_en, title_ur, excerpt_en, excerpt_ur, body_en, body_ur, minutes, hue) VALUES
  ('article','zaujain','Building mercy in marriage','نکاح میں رحمت پیدا کرنا','Small daily habits that grow lasting affection between spouses.','روزمرہ کی چھوٹی عادات جو میاں بیوی میں پائیدار محبت پیدا کرتی ہیں۔','Mercy in marriage begins with small consistent acts — a kind word at breakfast, a moment of listening after work, remembering the little things...','نکاح میں رحمت چھوٹے مستقل اعمال سے شروع ہوتی ہے — ناشتے پر ایک نرم لفظ، کام کے بعد سننے کا لمحہ، چھوٹی چیزیں یاد رکھنا...',6,220),
  ('article','zaujain','Listening without fixing','بغیر حل بتائے سننا','A gentle framework for conversations that heal instead of harm.','ایسی گفتگو کا نرم طریقہ جو زخم نہیں بھرتا بلکہ شفا دیتا ہے۔','Often the loved one wants to be heard, not fixed. Pause. Reflect back. Ask what would help.','اکثر پیارا سننا چاہتا ہے، حل نہیں۔ ٹھہریں۔ دہرائیں۔ پوچھیں کیا مدد ہو گی۔',4,210),
  ('article','aulad','Raising confident children','خود اعتماد بچوں کی پرورش','Encouragement patterns that build inner steadiness.','حوصلہ افزائی کے وہ طریقے جو اندرونی سکون پیدا کرتے ہیں۔','Praise effort over outcome. Name the specific virtue you see. Let them struggle safely.','نتیجے سے زیادہ کوشش کی تعریف کریں۔ جو خوبی نظر آئے اس کا نام لیں۔',7,45),
  ('video','aulad','Screens and family time','اسکرین اور خاندانی وقت','Simple boundaries that keep bedrooms and dinners device-free.','آسان حدود جو بستر اور کھانا آلات سے پاک رکھتی ہیں۔','Two rules change everything: no devices at meals, no devices in bedrooms.','دو اصول سب کچھ بدل دیتے ہیں: کھانے پر آلات نہیں، بستر میں آلات نہیں۔',5,30),
  ('pdf','parenting','The calm-parenting playbook','پُرسکون والدین کا رہنما','Respond, don''t react. A tested rhythm for hard mornings.','ردعمل نہیں، جواب دیں۔ مشکل صبحوں کے لیے آزمودہ ترتیب۔','Pause, breathe, name the feeling, then choose your response.','رکیں، سانس لیں، احساس کا نام لیں، پھر جواب چنیں۔',9,260),
  ('article','marriage','Money, mercy, and marriage','پیسہ، رحمت اور نکاح','A monthly ritual to talk finances without friction.','بغیر جھگڑے مالی گفتگو کے لیے ماہانہ عمل۔','Set a monthly 30-minute money meeting. Same time, same tea, same script.','ماہانہ 30 منٹ کی مالی ملاقات مقرر کریں۔ ایک ہی وقت، ایک ہی چائے۔',8,190),
  ('article','family','In-laws with grace','سسرال کے ساتھ خوش اسلوبی','Boundaries that protect love on both sides.','ایسی حدود جو دونوں طرف کی محبت کو محفوظ رکھیں۔','Kind boundaries are still kind. Say yes to what you can, no to what you cannot.','نرم حدود بھی نرم ہیں۔ جو ہو سکے ہاں کہیں، جو نہ ہو نہ کہیں۔',6,340),
  ('video','family','The dinner table blueprint','دسترخوان کا خاکہ','A 20-minute nightly ritual that keeps a household close.','روزانہ 20 منٹ کا عمل جو گھر کو قریب رکھتا ہے۔','One question, one gratitude, one plan for tomorrow.','ایک سوال، ایک شکر، کل کا ایک منصوبہ۔',5,160),
  ('pdf','marriage','Repair after a hard week','مشکل ہفتے کے بعد جوڑ','A short repair conversation that actually lands.','ایک مختصر گفتگو جو دل تک پہنچتی ہے۔','Own your part first. Then ask what they need.','پہلے اپنی غلطی مانیں۔ پھر ان کی ضرورت پوچھیں۔',4,280);

INSERT INTO public.case_studies (title_en, title_ur, excerpt_en, excerpt_ur, body_en, body_ur, category_en, category_ur, hue) VALUES
  ('The quiet reconciliation','خاموش صلح','How a couple rebuilt trust after a year of silence.','ایک سالہ خاموشی کے بعد جوڑے نے اعتماد کیسے دوبارہ بنایا۔','Ahmed and Sara had drifted for months. A weekly 20-minute check-in — no phones, no arguments, only listening — slowly opened the door again.','احمد اور سارہ کئی ماہ سے دور ہو گئے تھے۔ ہفتہ وار 20 منٹ کی ملاقات نے دروازہ کھول دیا۔','Marriage','نکاح',220),
  ('A teenager coming home','نوجوان کا واپس آنا','Parents who traded lectures for curiosity — and got their son back.','والدین جنہوں نے لیکچر چھوڑ کر تجسس اپنایا اور بیٹا واپس پایا۔','Instead of confrontation, they began asking one open-ended question a night. It took three months, but the door opened.','سختی کے بجائے، انہوں نے روز ایک کھلا سوال پوچھنا شروع کیا۔ تین ماہ لگے، مگر دروازہ کھل گیا۔','Parenting','پرورش',45),
  ('Two households, one child','دو گھر، ایک بچہ','Coordinating co-parenting without competing.','بغیر مقابلے کے مشترکہ پرورش۔','After separation, they built a shared calendar and a single set of rules.','علیحدگی کے بعد، انہوں نے مشترکہ کیلنڈر اور یکساں اصول بنائے۔','Family','خاندان',160),
  ('The in-law boundary','سسرال کی حد','A daughter-in-law found kindness that also protects her.','بہو نے ایسی نرمی پائی جو حفاظت بھی کرے۔','She stopped saying yes to every request and started saying "let me check with my husband."','اس نے ہر بات پر ہاں کہنا چھوڑا۔','Family','خاندان',340);

INSERT INTO public.counselors (name, role_en, role_ur, focus_en, focus_ur, years, initials, hue) VALUES
  ('Dr. Amina Rahman','Family therapist','خاندانی معالج','Marriage & communication','نکاح اور گفتگو',12,'AR',220),
  ('Ustadh Yusuf Khan','Islamic family counselor','اسلامی خاندانی مشیر','Youth & parenting','نوجوان اور پرورش',9,'YK',45),
  ('Sadia Malik, MSW','Clinical social worker','کلینیکل سماجی کارکن','Conflict & repair','تنازعہ اور مصالحت',7,'SM',340);

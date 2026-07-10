
CREATE OR REPLACE FUNCTION public.notify_counseling_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications (user_id, type, title_en, title_ur, body_en, body_ur)
    VALUES (
      NEW.user_id,
      'system',
      'Counseling request updated',
      'مشاورت کی درخواست اپ ڈیٹ ہوگئی',
      'Your request status is now: ' || NEW.status,
      'آپ کی درخواست کی حالت: ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_counseling_status ON public.counseling_requests;
CREATE TRIGGER trg_notify_counseling_status
AFTER UPDATE ON public.counseling_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_counseling_status_change();

DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

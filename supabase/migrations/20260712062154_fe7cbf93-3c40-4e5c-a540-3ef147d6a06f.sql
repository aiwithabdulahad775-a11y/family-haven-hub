
-- Restore Data API grants on public tables (missing after remix)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
GRANT SELECT ON public.content_items TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
GRANT SELECT ON public.case_studies TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.counselors TO authenticated;
GRANT ALL ON public.counselors TO service_role;
GRANT SELECT ON public.counselors TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
GRANT SELECT ON public.categories TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_items TO authenticated;
GRANT ALL ON public.saved_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.counseling_requests TO authenticated;
GRANT ALL ON public.counseling_requests TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.counseling_notes TO authenticated;
GRANT ALL ON public.counseling_notes TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

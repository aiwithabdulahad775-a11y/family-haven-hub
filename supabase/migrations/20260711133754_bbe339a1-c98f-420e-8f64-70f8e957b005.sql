REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_roles() FROM authenticated, anon, PUBLIC;
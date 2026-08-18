-- 1. Hide sellers.password_hash from public API reads (column-level privileges)
REVOKE SELECT ON public.sellers FROM anon, authenticated;
GRANT SELECT (id, name, slug, username, logo_url, banner_url, description, active, created_at, updated_at, external_url, link_mode)
  ON public.sellers TO anon, authenticated;
GRANT ALL ON public.sellers TO service_role;

-- 2. Remove public write/delete access to the product-images bucket
DROP POLICY IF EXISTS "product images insert" ON storage.objects;
DROP POLICY IF EXISTS "product images update" ON storage.objects;
DROP POLICY IF EXISTS "product images delete" ON storage.objects;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes text[] NOT NULL DEFAULT '{}'::text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[];
INSERT INTO public.settings (key, value) VALUES
  ('admin_username', 'replikaenjoyeradmin'),
  ('admin_password_hash', 'a8bf5c33c4cee8bd6e5b31b0e2ee69ba98a5a9be0da95c07c1a3ef67a4f7edc0')
ON CONFLICT (key) DO NOTHING;
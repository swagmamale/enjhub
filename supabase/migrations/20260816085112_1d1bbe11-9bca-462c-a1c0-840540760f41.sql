ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_url text NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_name text NOT NULL DEFAULT '';
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.shipping_rates ADD COLUMN IF NOT EXISTS price_table jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS link_mode text NOT NULL DEFAULT 'agents';
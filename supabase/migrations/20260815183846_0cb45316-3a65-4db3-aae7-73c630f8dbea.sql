
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS batch text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tiktok_url text,
  ADD COLUMN IF NOT EXISTS price_cny numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS promoted boolean NOT NULL DEFAULT false;

ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS external_url text NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS public.promos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  link_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promos TO anon, authenticated;
GRANT ALL ON public.promos TO service_role;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promos public read" ON public.promos FOR SELECT USING (true);
CREATE POLICY "promos public write" ON public.promos FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO anon, authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social public read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "social public write" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  line_name text NOT NULL DEFAULT 'Standard',
  base_price numeric NOT NULL DEFAULT 0,
  price_per_kg numeric NOT NULL DEFAULT 0,
  min_weight numeric NOT NULL DEFAULT 0,
  max_weight numeric NOT NULL DEFAULT 30,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_rates TO anon, authenticated;
GRANT ALL ON public.shipping_rates TO service_role;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shipping public read" ON public.shipping_rates FOR SELECT USING (true);
CREATE POLICY "shipping public write" ON public.shipping_rates FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.social_links (label, url, icon, sort_order)
SELECT 'TikTok', '', 'TT', 1
WHERE NOT EXISTS (SELECT 1 FROM public.social_links);
INSERT INTO public.social_links (label, url, icon, sort_order)
SELECT 'Discord', '', 'DC', 2
WHERE NOT EXISTS (SELECT 1 FROM public.social_links WHERE label = 'Discord');

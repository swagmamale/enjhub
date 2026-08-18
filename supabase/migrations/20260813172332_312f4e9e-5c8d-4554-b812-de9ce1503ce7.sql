
CREATE TABLE public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories public write" ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  referral_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agents TO anon, authenticated;
GRANT ALL ON public.agents TO service_role;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agents public read" ON public.agents FOR SELECT USING (true);
CREATE POLICY "agents public write" ON public.agents FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  price numeric not null default 0,
  image_url text,
  qc_url text,
  quality text not null default 'Best',
  likes int not null default 0,
  dislikes int not null default 0,
  views int not null default 0,
  agent_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products public write" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.guide_steps (
  id uuid primary key default gen_random_uuid(),
  step_number int not null default 1,
  title text not null,
  description text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guide_steps TO anon, authenticated;
GRANT ALL ON public.guide_steps TO service_role;
ALTER TABLE public.guide_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guide public read" ON public.guide_steps FOR SELECT USING (true);
CREATE POLICY "guide public write" ON public.guide_steps FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.settings (
  key text primary key,
  value text not null default ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings public write" ON public.settings FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.categories (name, slug, sort_order) VALUES
 ('Buty','buty',1),('Spodnie','spodnie',2),('Kurtki','kurtki',3),('Koszulki','koszulki',4),('Bluzy','bluzy',5),('Akcesoria','akcesoria',6),('Zegarki','zegarki',7);

INSERT INTO public.agents (name, avatar_url, referral_url, sort_order) VALUES
 ('Litbuy','https://ui-avatars.com/api/?name=L&background=0d9488&color=fff','https://litbuy.com/register?ref=PKMR',1),
 ('Kakaobuy','https://ui-avatars.com/api/?name=K&background=06b6d4&color=fff','https://kakobuy.com/register?ref=PKMR',2),
 ('USFans','https://ui-avatars.com/api/?name=U&background=00f2fe&color=001&','https://usfans.com/register?ref=PKMR',3);

INSERT INTO public.settings (key, value) VALUES
 ('agent_logo_url','https://ui-avatars.com/api/?name=PKMR&background=0b0f19&color=00f2fe&size=256'),
 ('primary_agent_url','https://litbuy.com/register?ref=PKMR'),
 ('promo_banner_url',''),
 ('promo_code','PKMR'),
 ('tiktok_url','https://tiktok.com'),
 ('discord_url','https://discord.com'),
 ('telegram_url','https://telegram.org'),
 ('whatsapp_url','https://whatsapp.com'),
 ('instagram_url','https://instagram.com');

INSERT INTO public.guide_steps (step_number, title, description, image_url) VALUES
 (1,'Załóż konto u agenta','Kliknij w link rejestracyjny, załóż konto i odbierz kupony powitalne.',null),
 (2,'Skopiuj link produktu','Skopiuj link z naszej strony lub z TikToka i wklej go w wyszukiwarkę agenta.',null),
 (3,'Zamów i sprawdź QC','Opłać zamówienie, poczekaj na zdjęcia QC i zaakceptuj jakość.',null),
 (4,'Wyślij paczkę','Wybierz metodę wysyłki, opłać shipping i czekaj na paczkę.',null);

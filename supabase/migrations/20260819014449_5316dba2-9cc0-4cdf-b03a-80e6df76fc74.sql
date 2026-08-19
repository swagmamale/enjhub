ALTER TABLE public.shipping_rates
  ADD COLUMN IF NOT EXISTS discount_percent numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coupon_code text NOT NULL DEFAULT '';
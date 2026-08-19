insert into public.categories (name, slug, sort_order)
select distinct p.category,
       lower(regexp_replace(regexp_replace(trim(p.category), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')),
       100
from public.products p
where trim(p.category) <> ''
  and p.category not in (select name from public.categories);
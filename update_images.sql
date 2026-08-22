-- SQL query to update all product and featured item image URLs with high-quality cake images

UPDATE public.products SET img = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop' WHERE id = 'c1';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop' WHERE id = 'c2';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop' WHERE id = 'c3';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop' WHERE id = 'c4';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop' WHERE id = 'c5';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop' WHERE id = 'c7';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop' WHERE id = 'prod_v1s6bcz9';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop' WHERE id = 'cu1';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop' WHERE id = 'cu2';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800&auto=format&fit=crop' WHERE id = 'cu3';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1599785209707-a456fc1337cc?q=80&w=800&auto=format&fit=crop' WHERE id = 'cu4';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop' WHERE id = 'cu5';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=800&auto=format&fit=crop' WHERE id = 'cu6';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop' WHERE id = 'brownies-box';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop' WHERE id = 'mc1';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop' WHERE id = 'mc2';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop' WHERE id = 'cp1';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop' WHERE id = 'cp2';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop' WHERE id = 'cp3';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop' WHERE id = 't3';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop' WHERE id = 't4';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop' WHERE id = 'cakesicles-bulk';
UPDATE public.products SET img = 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop' WHERE id = 't2';

-- Update Featured Carousel Images
UPDATE public.featured_items SET img = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop' WHERE id = 'featured-1' OR slot = 1;
UPDATE public.featured_items SET img = 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop' WHERE id = 'featured-2' OR slot = 2;
UPDATE public.featured_items SET img = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop' WHERE id = 'featured-3' OR slot = 3;

-- Seed script to populate new Supabase project database

-- 1. PRODUCTS (24 items)
INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c1', 'Cakes', NULL, '6 inch, 2 Layer (Round)', '€45', 'Serves ~10. Classic round cake. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY[]::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY[]::text[], ARRAY[]::text[], 'In Stock', TRUE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-c1-1781039240493.webp?t=1781039242148', 'Serves 10')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cu2', 'Cupcakes', 'Buttercream', 'Buttercream (Box of 12)', '€28.80', 'A full dozen premium buttercream cupcakes. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cupcakes/butter2.webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cp1', 'Cake Pops', NULL, 'Cake Pops (Each)', '€1.70', 'Delicious cake pops (minimum order 15). Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY[]::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-pops/pops-(1).webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('mc1', 'Mini Cakes', NULL, 'Mini Cake (Small)', '€3.50', 'Bite-sized indulgence (Single portion). Choice of Chocolate, Vanilla, or Red Velvet flavors. Choice of 1 signature spread.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Chocolate', 'Vanilla', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, FALSE, 4, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/minicakes/2.webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('t4', 'Cakesicles', NULL, 'Cakesicles (Box of 10)', '€29', 'A premium box of 10 cakesicles. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY[]::text[], 'In Stock', FALSE, TRUE, 1, TRUE, FALSE, TRUE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-sicles/cakesicles-(3).webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c-3d', 'Cakes', NULL, '3D Custom Cake Designer', 'WA', 'Design your own cake in 3D! Choose layers, shapes, and decorations to see your masterpiece come to life.', NULL, TRUE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c7', 'Cakes', NULL, '8 inch, 3 Layer (Heart)', '€95', 'Serves ~ 30 - 38. Tall and impressive heart-shaped cake. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', TRUE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/heart/heart-(3).webp', 'Serves 30 - 38')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('t2', 'Breakable Hearts', NULL, 'Breakable Heart Box', '€37', 'Heart made of White Chocolate filled with marshmallows & chopsticks. Includes 8 cakesicles.', ARRAY[]::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY[]::text[], ARRAY[]::text[], 'In Stock', FALSE, FALSE, 1, TRUE, TRUE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-t2-1781039943586.webp?t=1781039945400', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('brownies-box', 'Brownies', NULL, 'Signature Brownies Box', '€32', 'Rich chocolate brownies with your choice of up to 3 signature spreads.', ARRAY['[object Object]', '[object Object]', '[object Object]', '[object Object]', '[object Object]', '[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Classic Chocolate']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/brownies/brownie.webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c4', 'Cakes', NULL, '8 inch, 2 Layer (Heart)', '€72', 'Serves ~20 - 25. Show extra love with a large heart shape. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', TRUE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/heart/heart-(2).webp', 'Serves 20 - 25')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cu1', 'Cupcakes', 'Buttercream', 'Buttercream (Box of 6)', '€15', 'A half-dozen of our fluffiest buttercream cupcakes. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-cu1-1781612066880.webp?t=1781612069213', '')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cu3', 'Cupcakes', 'Buttercream', 'Buttercream (Additional)', '€2.20', 'Add an individual buttercream cupcake to your order. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cupcakes/butter3.webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cakesicles-bulk', 'Cakesicles', NULL, 'Additional Cakesicles', '€2.60', 'Add extra cakesicles to your order. Tiered pricing available for bulk orders.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY[]::text[], 'In Stock', FALSE, TRUE, 1, TRUE, FALSE, TRUE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-sicles/cakesicles-(4).webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cp2', 'Cake Pops', NULL, 'Cake Pops (Pack of 15)', '€25.50', 'A standard pack of 15 cake pops. Perfect for small gatherings. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY[]::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-pops/pops-(2).webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('t3', 'Cakesicles', NULL, 'Cakesicles (Box of 5)', '€17', 'Cake truffles on a stick (Minimum order). Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY[]::text[], 'In Stock', FALSE, TRUE, 1, TRUE, FALSE, TRUE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-sicles/cakesicles-(1).webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cu5', 'Cupcakes', 'White Chocolate', 'White Chocolate (Box of 12)', '€32.50', 'A full dozen premium white chocolate cupcakes. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, TRUE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-cu5-1781862499787.webp?t=1781862501404', '')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cp3', 'Cake Pops', NULL, 'Cake Pops (Pack of 30)', '€51.00', 'A large pack of 30 cake pops for parties. Choice of Chocolate, Vanilla, or Red Velvet.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY[]::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-pops/pops-(3).webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('mc2', 'Mini Cakes', NULL, 'Mini Cake (Large)', '€5.50', 'A delightful small treat (Large portion). Choice of Chocolate, Vanilla, or Red Velvet flavors. Choice of 1 signature spread.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Chocolate', 'Vanilla', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, FALSE, 4, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/minicakes/1.webp', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c5', 'Cakes', NULL, '8 inch, 3 Layer (Round)', '€85', 'Serves ~ 30 - 38. Grand 3-layer masterpiece. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', TRUE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/round/round-(11).webp', 'Serves 30 - 38')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('prod_v1s6bcz9', 'Cakes', NULL, '6 Inch 3 Layer', '€', 'Serves ~15 - 18. Classic round cake. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY[]::text[], FALSE, '2026-06-15T09:39:11.732+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', FALSE, FALSE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-prod_v1s6bcz9-1781612982675.webp?t=1781612983827', 'Serves 15 - 18')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cu6', 'Cupcakes', 'White Chocolate', 'White Chocolate (Additional)', '€2.50', 'Add an individual white chocolate cupcake to your order. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, TRUE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-cu6-1781630115744.webp?t=1781630117992', '')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c2', 'Cakes', NULL, '6 inch, 2 Layer (Heart)', '€50', 'Serves ~10. Elegant heart-shaped design. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', TRUE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/heart/heart-(1).webp', 'Serves 10')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('c3', 'Cakes', NULL, '8 inch, 2 Layer (Round)', '€65', 'Serves ~20 - 25. Perfect for celebrations. Choice of Chocolate, Vanilla, or Red Velvet flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']::text[], 'In Stock', TRUE, FALSE, 1, TRUE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/round/round-(2).webp', 'Serves 20 - 25')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

INSERT INTO public.products (id, category, subcategory, name, price, description, options, is_full_width, created_at, flavours, spreads, status, bows, individual_packaging, min_qty, has_message, has_inner_message, has_edible_printing, img, portions)
VALUES ('cu4', 'Cupcakes', 'White Chocolate', 'White Chocolate (Box of 6)', '€17', 'A half-dozen decadent white chocolate cupcakes. Choice of flavors.', ARRAY['[object Object]']::text[], FALSE, '2026-05-20T15:40:56.029484+00:00', ARRAY['Vanilla', 'Chocolate', 'Red Velvet']::text[], ARRAY['Nutella', 'Biscoff', 'Pistachio', 'Kinder']::text[], 'In Stock', FALSE, TRUE, 1, FALSE, FALSE, FALSE, 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/product-cu4-1781629809229.webp?t=1781629821242', '')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, img = EXCLUDED.img, category = EXCLUDED.category;

-- 2. FEATURED ITEMS (3 items)
INSERT INTO public.featured_items (slot, id, name, price, description, img, highlights, is_empty, created_at)
VALUES (2, 'featured-2', 'Signature Cupcakes', '€xx', 'A curated selection of our most loved cupcake flavors, perfect for any occasion.', 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/featured-images/slot-2-1781342106904.webp', ARRAY[]::text[], FALSE, '2026-06-13T08:44:00.334542+00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.featured_items (slot, id, name, price, description, img, highlights, is_empty, created_at)
VALUES (1, 'featured-1', 'Brownie Selection', '€xx', 'Our most popular brownie assortment, baked fresh daily with premium chocolate.', 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/featured-images/slot-1-1781342526005.webp', ARRAY[]::text[], FALSE, '2026-06-13T08:44:00.334542+00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.featured_items (slot, id, name, price, description, img, highlights, is_empty, created_at)
VALUES (3, 'featured-3', 'Best Seller cake', '€xx', 'Our signature masterpiece cake, loved by everyone for its perfect balance of flavor.', 'https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/featured-images/slot-3-1781342607451.webp', ARRAY[]::text[], FALSE, '2026-06-13T08:44:00.334542+00:00')
ON CONFLICT (id) DO NOTHING;

-- 3. STORE SETTINGS
INSERT INTO public.store_settings (id, whatsapp_number, instagram_link, facebook_link, updated_at)
VALUES (1, '35679820529', 'https://instagram.com/minibakes2021', 'https://facebook.com/minibakes2021', '2026-06-11T11:42:47.679682+00:00')
ON CONFLICT (id) DO NOTHING;

-- 4. STORE AVAILABILITY
INSERT INTO public.store_availability (id, is_taking_orders_today, vacation_start_date, vacation_end_date, vacation_message, updated_at, daily_pause_message)
VALUES (1, TRUE, NULL, NULL, 'We are currently away on vacation. Check back soon!', '2026-06-13T08:03:59.687+00:00', 'We are not taking any more orders today. Please check back tomorrow!')
ON CONFLICT (id) DO NOTHING;


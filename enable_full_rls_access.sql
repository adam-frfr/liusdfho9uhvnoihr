-- Enable public / anon read and write access on all bakery tables

-- 1. ORDERS
DROP POLICY IF EXISTS "Public Anon Insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public Anon Select orders" ON public.orders;
DROP POLICY IF EXISTS "Public Anon Update orders" ON public.orders;
DROP POLICY IF EXISTS "Public Anon Delete orders" ON public.orders;

CREATE POLICY "Public Anon Insert orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select orders" ON public.orders FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update orders" ON public.orders FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete orders" ON public.orders FOR DELETE TO public USING (true);

-- 2. PRODUCTS
DROP POLICY IF EXISTS "Public Anon Insert products" ON public.products;
DROP POLICY IF EXISTS "Public Anon Select products" ON public.products;
DROP POLICY IF EXISTS "Public Anon Update products" ON public.products;
DROP POLICY IF EXISTS "Public Anon Delete products" ON public.products;

CREATE POLICY "Public Anon Insert products" ON public.products FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update products" ON public.products FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete products" ON public.products FOR DELETE TO public USING (true);

-- 3. FEATURED ITEMS
DROP POLICY IF EXISTS "Public Anon Insert featured_items" ON public.featured_items;
DROP POLICY IF EXISTS "Public Anon Select featured_items" ON public.featured_items;
DROP POLICY IF EXISTS "Public Anon Update featured_items" ON public.featured_items;
DROP POLICY IF EXISTS "Public Anon Delete featured_items" ON public.featured_items;

CREATE POLICY "Public Anon Insert featured_items" ON public.featured_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select featured_items" ON public.featured_items FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update featured_items" ON public.featured_items FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete featured_items" ON public.featured_items FOR DELETE TO public USING (true);

-- 4. STORE SETTINGS
DROP POLICY IF EXISTS "Public Anon Insert store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public Anon Select store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public Anon Update store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public Anon Delete store_settings" ON public.store_settings;

CREATE POLICY "Public Anon Insert store_settings" ON public.store_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select store_settings" ON public.store_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update store_settings" ON public.store_settings FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete store_settings" ON public.store_settings FOR DELETE TO public USING (true);

-- 5. STORE AVAILABILITY
DROP POLICY IF EXISTS "Public Anon Insert store_availability" ON public.store_availability;
DROP POLICY IF EXISTS "Public Anon Select store_availability" ON public.store_availability;
DROP POLICY IF EXISTS "Public Anon Update store_availability" ON public.store_availability;
DROP POLICY IF EXISTS "Public Anon Delete store_availability" ON public.store_availability;

CREATE POLICY "Public Anon Insert store_availability" ON public.store_availability FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select store_availability" ON public.store_availability FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update store_availability" ON public.store_availability FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete store_availability" ON public.store_availability FOR DELETE TO public USING (true);

-- 6. CLIENTS
DROP POLICY IF EXISTS "Public Anon Insert clients" ON public.clients;
DROP POLICY IF EXISTS "Public Anon Select clients" ON public.clients;
DROP POLICY IF EXISTS "Public Anon Update clients" ON public.clients;
DROP POLICY IF EXISTS "Public Anon Delete clients" ON public.clients;

CREATE POLICY "Public Anon Insert clients" ON public.clients FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select clients" ON public.clients FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update clients" ON public.clients FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete clients" ON public.clients FOR DELETE TO public USING (true);

-- 7. CLASS BOOKINGS
DROP POLICY IF EXISTS "Public Anon Insert class_bookings" ON public.class_bookings;
DROP POLICY IF EXISTS "Public Anon Select class_bookings" ON public.class_bookings;
DROP POLICY IF EXISTS "Public Anon Update class_bookings" ON public.class_bookings;
DROP POLICY IF EXISTS "Public Anon Delete class_bookings" ON public.class_bookings;

CREATE POLICY "Public Anon Insert class_bookings" ON public.class_bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select class_bookings" ON public.class_bookings FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update class_bookings" ON public.class_bookings FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete class_bookings" ON public.class_bookings FOR DELETE TO public USING (true);

-- 8. BOOKED DATES
DROP POLICY IF EXISTS "Public Anon Insert booked_dates" ON public.booked_dates;
DROP POLICY IF EXISTS "Public Anon Select booked_dates" ON public.booked_dates;
DROP POLICY IF EXISTS "Public Anon Update booked_dates" ON public.booked_dates;
DROP POLICY IF EXISTS "Public Anon Delete booked_dates" ON public.booked_dates;

CREATE POLICY "Public Anon Insert booked_dates" ON public.booked_dates FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public Anon Select booked_dates" ON public.booked_dates FOR SELECT TO public USING (true);
CREATE POLICY "Public Anon Update booked_dates" ON public.booked_dates FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Delete booked_dates" ON public.booked_dates FOR DELETE TO public USING (true);

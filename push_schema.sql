-- 1. Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    birthday DATE,
    last_notified_at TIMESTAMP WITH TIME ZONE,
    notification_count INTEGER DEFAULT 0,
    last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create cart_reminders table
CREATE TABLE IF NOT EXISTS cart_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE CASCADE,
    last_cart_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Safely update orders table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subscription_id') THEN
        ALTER TABLE orders ADD COLUMN subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_placed_at') THEN
        ALTER TABLE orders ADD COLUMN order_placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'ready_notification_sent') THEN
        ALTER TABLE orders ADD COLUMN ready_notification_sent BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'followup_sent') THEN
        ALTER TABLE orders ADD COLUMN followup_sent BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

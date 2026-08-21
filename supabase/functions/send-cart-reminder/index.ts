// @ts-ignore: Deno runtime import
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { sendPushNotification } from '../_shared/push.ts';
import { getSupabaseClient } from '../_shared/supabaseClient.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // This function will be triggered by a cron job
    // It finds carts abandoned for more than 1 hour where a reminder hasn't been sent
    
    const supabase = getSupabaseClient();
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: abandonedCarts, error } = await supabase
      .from('cart_reminders')
      .select('*, push_subscriptions(endpoint, p256dh, auth)')
      .eq('sent', false)
      .lt('last_cart_update', oneHourAgo);

    if (error) throw error;

    let successCount = 0;
    let failCount = 0;

    for (const cart of abandonedCarts || []) {
      if (!cart.push_subscriptions || !cart.push_subscriptions.endpoint) continue;

      const subscription = {
        endpoint: cart.push_subscriptions.endpoint,
        keys: {
          p256dh: cart.push_subscriptions.p256dh,
          auth: cart.push_subscriptions.auth
        }
      };

      const payload = {
        title: 'You left something sweet behind! 🧁',
        body: `You still have items waiting in your cart. Complete your order before we fill up!`,
        icon: '/mini_icon.webp',
        badge: '/mini_icon.webp',
        data: { url: '/?view=order' }
      };

      const result = await sendPushNotification(subscription, payload);
      
      if (result.success) {
        successCount++;
        // Mark as sent so it only sends ONE time per session
        await supabase
          .from('cart_reminders')
          .update({ sent: true })
          .eq('subscription_id', cart.subscription_id);
      } else {
        failCount++;
        if (result.expired) {
          await supabase.from('push_subscriptions').delete().eq('id', cart.subscription_id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed: abandonedCarts?.length || 0, successCount, failCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
  }
});

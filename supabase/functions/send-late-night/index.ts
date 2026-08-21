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
    const supabase = getSupabaseClient();
    
    // Find users who haven't visited in 3+ days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .lt('last_visited_at', threeDaysAgo);

    if (error) throw error;

    let successCount = 0;
    let failCount = 0;

    for (const sub of subs || []) {
      const payload = {
        title: '🌙 Late night cravings?',
        body: 'Plan ahead — order your Mini Bakes treat for tomorrow. We\'ll have it fresh and ready!',
        icon: '/mini_icon.webp',
        badge: '/mini_icon.webp',
        data: { url: '/' }
      };

      const subscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      };

      const result = await sendPushNotification(subscription, payload);
      
      if (result.success) {
        successCount++;
        // Update last_visited_at slightly so it doesn't fire every single day if they ignore it
        // Or we just let it fire until they visit? No, let's bump it by 1 day so it fires every 4 days
        await supabase
          .from('push_subscriptions')
          .update({ last_visited_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() })
          .eq('id', sub.id);
      } else {
        failCount++;
        if (result.expired) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed: subs?.length || 0, successCount, failCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
  }
});

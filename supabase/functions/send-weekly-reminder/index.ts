// @ts-ignore: Deno runtime import
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { sendPushNotification } from '../_shared/push.ts';
import { getSupabaseClient } from '../_shared/supabaseClient.ts';

const messages = [
  { title: '🎂 Something sweet is waiting for you!', body: 'Your favourite Mini Bakes treats are fresh and ready. Don\'t keep them waiting!' },
  { title: '🧁 We\'ve been thinking about you...', body: 'It\'s been a while! Come see what\'s new at Mini Bakes this week.' },
  { title: '🍰 Your next celebration starts here', body: 'Whether it\'s a birthday, anniversary or just a treat — we\'ve got you covered.' },
  { title: '💕 Mini Bakes misses you!', body: 'Life\'s too short to skip dessert. Come pick your favourite today.' }
];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient();
    
    // Find subscriptions where last_notified_at is older than 7 days
    // Or last_notified_at is null AND created_at is older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .or(`last_notified_at.lt.${sevenDaysAgo},and(last_notified_at.is.null,created_at.lt.${sevenDaysAgo})`);

    if (error) throw error;

    let successCount = 0;
    let failCount = 0;

    for (const sub of subs || []) {
      const msgIndex = (sub.notification_count || 0) % messages.length;
      const msg = messages[msgIndex];

      const payload = {
        title: msg.title,
        body: msg.body,
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
        await supabase
          .from('push_subscriptions')
          .update({ 
            last_notified_at: new Date().toISOString(),
            notification_count: (sub.notification_count || 0) + 1
          })
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

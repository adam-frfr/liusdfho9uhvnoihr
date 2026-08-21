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
    
    // Calculate the date 7 days from now (MM-DD format to ignore year)
    const targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
    const targetDay = String(targetDate.getDate()).padStart(2, '0');
    const targetMMDD = `${targetMonth}-${targetDay}`;

    // Get all subscriptions with a birthday
    // (Postgres date functions might be better, but we can filter in memory for now or use a view)
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .not('birthday', 'is', null);

    if (error) throw error;

    let successCount = 0;
    let failCount = 0;

    for (const sub of subs || []) {
      if (!sub.birthday) continue;
      
      // sub.birthday is usually YYYY-MM-DD
      const bdayMatch = sub.birthday.match(/\d{4}-(\d{2})-(\d{2})/);
      if (!bdayMatch) continue;
      const bdayMMDD = `${bdayMatch[1]}-${bdayMatch[2]}`;

      if (bdayMMDD === targetMMDD) {
        const payload = {
          title: 'Your birthday is in 7 days! 🎉',
          body: "Don't forget to order your cake — we need a few days to make it perfect.",
          icon: '/mini_icon.webp',
          badge: '/mini_icon.webp',
          data: { url: '/?view=order' }
        };

        const subscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      };

      const result = await sendPushNotification(subscription, payload);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          if (result.expired) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, successCount, failCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
  }
});

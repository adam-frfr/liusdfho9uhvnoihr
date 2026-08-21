// @ts-ignore: Deno runtime import
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { sendPushNotification } from '../_shared/push.ts';
import { getSupabaseClient } from '../_shared/supabaseClient.ts';

const occasions = [
  { month: 2, day: 14, name: "Valentine's Day" },
  { month: 3, day: 17, name: "St. Patrick's Day" },
  { month: 5, day: 12, name: "Mother's Day" }, // Approximation for 2nd Sunday
  { month: 6, day: 1, name: "Graduation Season" },
  { month: 6, day: 16, name: "Father's Day" }, // Approximation for 3rd Sunday
  { month: 10, day: 31, name: "Halloween" },
  { month: 12, day: 25, name: "Christmas" },
  { month: 12, day: 31, name: "New Year's Eve" }
];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const targetMonth = targetDate.getMonth() + 1;
    const targetDay = targetDate.getDate();

    const upcomingOccasion = occasions.find(o => o.month === targetMonth && o.day === targetDay);

    if (!upcomingOccasion) {
      return new Response(JSON.stringify({ success: true, message: 'No occasions in 7 days' }), { headers: corsHeaders });
    }

    const supabase = getSupabaseClient();
    
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw error;

    let successCount = 0;
    let failCount = 0;

    for (const sub of subs || []) {
      const payload = {
        title: `${upcomingOccasion.name} is in 1 week! 💕`,
        body: `Order your custom Mini Bakes treats now — spots are filling fast. Don't leave it too late!`,
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

    return new Response(JSON.stringify({ success: true, occasion: upcomingOccasion.name, successCount, failCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
  }
});

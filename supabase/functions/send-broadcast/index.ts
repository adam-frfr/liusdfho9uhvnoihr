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
    const { title, body } = await req.json();
    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'Title and body are required' }), { status: 400, headers: corsHeaders });
    }

    const supabase = getSupabaseClient();
    
    // Fetch all active subscriptions
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw error;

    let successCount = 0;
    let failCount = 0;

    for (const sub of subs || []) {
      const payload = {
        title,
        body,
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
      } else {
        failCount++;
        // If expired, remove it
        if (result.expired) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
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

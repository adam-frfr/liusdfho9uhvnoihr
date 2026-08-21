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
    const { orderId } = await req.json();
    if (!orderId) throw new Error('orderId is required');

    const supabase = getSupabaseClient();
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, push_subscriptions(endpoint, p256dh, auth)')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;
    
    // Mark as followup notification sent in db so website users get the update
    await supabase.from('orders').update({ followup_sent: true }).eq('id', orderId);
    
    if (!order.push_subscriptions || !order.push_subscriptions.endpoint) {
      return new Response(JSON.stringify({ success: true, message: 'Marked database flag. Customer has no push subscription linked.' }), { headers: corsHeaders });
    }

    const payload = {
      title: '💕 How was your Mini Bakes order?',
      body: `We hope you loved every bite! We're already ready for your next one 🎂`,
      icon: '/mini_icon.webp',
      badge: '/mini_icon.webp',
      data: { url: 'https://g.page/r/Cd7XYggirsHFEBM/review' }
    };

    const subscription = {
      endpoint: order.push_subscriptions.endpoint,
      keys: { p256dh: order.push_subscriptions.p256dh, auth: order.push_subscriptions.auth }
    };

    const result = await sendPushNotification(subscription, payload);
    
    if (result.success) {
      await supabase.from('orders').update({ followup_sent: true }).eq('id', orderId);
    } else if (result.expired) {
      await supabase.from('push_subscriptions').delete().eq('id', order.subscription_id);
    }

    return new Response(JSON.stringify({ success: result.success }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
  }
});

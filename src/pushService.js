import { supabase } from './supabase';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPush = async (birthday = null) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    }

    // Save to Supabase
    const subJson = subscription.toJSON();
    const endpoint = subJson.endpoint;
    const p256dh = subJson.keys.p256dh;
    const auth = subJson.keys.auth;

    let { data: existingSub } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .single();

    let subId = existingSub?.id;

    if (existingSub) {
      // Update last_visited_at and keys
      await supabase
        .from('push_subscriptions')
        .update({ 
          last_visited_at: new Date().toISOString(),
          p256dh,
          auth,
          ...(birthday ? { birthday } : {})
        })
        .eq('id', existingSub.id);
    } else {
      // Insert new
      const { data: newSub, error } = await supabase
        .from('push_subscriptions')
        .insert([{
          endpoint,
          p256dh,
          auth,
          last_visited_at: new Date().toISOString(),
          ...(birthday ? { birthday } : {})
        }])
        .select()
        .single();
        
      if (error) console.error('Error saving subscription:', error);
      subId = newSub?.id;
    }

    if (subId) {
      localStorage.setItem('minibakes_push_sub_id', subId);
    } else {
      localStorage.removeItem('minibakes_push_sub_id');
    }
    return subId;

  } catch (err) {
    console.error('Error subscribing to push:', err);
    return null;
  }
};

export const updateCartReminder = async (cartLength) => {
  const subId = localStorage.getItem('minibakes_push_sub_id');
  if (!subId) return;

  if (cartLength > 0) {
    // Upsert cart reminder
    const { data: existing } = await supabase
      .from('cart_reminders')
      .select('id')
      .eq('subscription_id', subId)
      .single();

    if (existing) {
      await supabase
        .from('cart_reminders')
        .update({ last_cart_update: new Date().toISOString(), sent: false })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_reminders')
        .insert([{
          subscription_id: subId,
          last_cart_update: new Date().toISOString(),
          sent: false
        }]);
    }
  } else {
    // Clear cart reminder
    await supabase
      .from('cart_reminders')
      .delete()
      .eq('subscription_id', subId);
  }
};

export const trackVisit = async () => {
  const subId = localStorage.getItem('minibakes_push_sub_id');
  if (!subId) return;

  await supabase
    .from('push_subscriptions')
    .update({ last_visited_at: new Date().toISOString() })
    .eq('id', subId);
};

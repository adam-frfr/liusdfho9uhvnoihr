import webPush from 'npm:web-push@3.6.7';

const VAPID_PUBLIC_KEY = Deno.env.get('VITE_VAPID_PUBLIC_KEY') || Deno.env.get('VAPID_PUBLIC_KEY') || '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'https://minibakes.netlify.app';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID Keys not fully configured. Push notifications will fail.");
}

export const sendPushNotification = async (subscription: any, payload: any) => {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error: any) {
    if (error.statusCode === 404 || error.statusCode === 410) {
      console.log('Subscription expired or removed:', subscription.endpoint);
      return { success: false, expired: true };
    }
    console.error('Error sending push notification', error);
    return { success: false, error };
  }
};

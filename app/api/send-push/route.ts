import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request: Request) {
  const webpush = (await import('web-push')).default;

  webpush.setVapidDetails(
    'mailto:qr.attendns@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  try {
    const { body } = await request.json();
    const subs = await prisma.pushSubscription.findMany();
    for (const sub of subs) {
      try {
        // Validate and cast keys
        const keys = sub.keys as { p256dh: string; auth: string } | null;
        if (!keys || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') {
          console.error('Invalid keys for subscription:', sub.endpoint, sub.keys);
          continue;
        }
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys, expirationTime: Date.now() + 12 * 60 * 60 * 1000 }, // 12 hours from now
          JSON.stringify({ title: 'QR Attendns', body })
        );
      } catch (err) {
        console.error('Failed to send notification to:', sub.endpoint, err);
      }
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
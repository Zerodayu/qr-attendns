import { db } from '@/drizzle';
import { pushSubscription } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const sub = await request.json();

  // Check if subscription exists
  const existing = await db
    .select()
    .from(pushSubscription)
    .where(eq(pushSubscription.endpoint, sub.endpoint));

  if (existing.length > 0) {
    // Update existing subscription
    await db
      .update(pushSubscription)
      .set({ keys: sub.keys })
      .where(eq(pushSubscription.endpoint, sub.endpoint));
  } else {
    // Create new subscription
    await db.insert(pushSubscription).values({
      endpoint: sub.endpoint,
      keys: sub.keys,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
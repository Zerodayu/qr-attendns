import { db } from "@/drizzle";
import { pushSubscription } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { endpoint } = await request.json();
  await db
    .delete(pushSubscription)
    .where(eq(pushSubscription.endpoint, endpoint));
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

